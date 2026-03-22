from __future__ import annotations

import argparse
import ast
import json
import re
from pathlib import Path
from typing import Any


CARD_ARRAY_RE = re.compile(
    r"export const (?P<name>MAJOR_ARCANA|MINOR_ARCANA):\s*TarotCard\[\]\s*="
)
POSITION_CONST_RE = re.compile(
    r"const (?P<name>[A-Z_]+_POSITIONS):\s*SpreadPositionLayout\[\]\s*="
)
SPREADS_RE = re.compile(r"export const SPREADS:\s*Record<SpreadType,\s*SpreadData>\s*=")


def strip_js_comments(source: str) -> str:
    result: list[str] = []
    i = 0
    in_string: str | None = None

    while i < len(source):
        ch = source[i]
        nxt = source[i + 1] if i + 1 < len(source) else ""
        prev = source[i - 1] if i > 0 else ""

        if in_string:
            result.append(ch)
            if ch == in_string and prev != "\\":
                in_string = None
            i += 1
            continue

        if ch in {"'", '"', "`"}:
            in_string = ch
            result.append(ch)
            i += 1
            continue

        if ch == "/" and nxt == "/":
            i += 2
            while i < len(source) and source[i] != "\n":
                i += 1
            continue

        if ch == "/" and nxt == "*":
            i += 2
            while i + 1 < len(source) and not (source[i] == "*" and source[i + 1] == "/"):
                i += 1
            i += 2
            continue

        result.append(ch)
        i += 1

    return "".join(result)


def extract_balanced(source: str, start_index: int) -> tuple[str, int]:
    opening = source[start_index]
    closing = {"[": "]", "{": "}", "(": ")"}[opening]
    depth = 0
    i = start_index
    in_string: str | None = None

    while i < len(source):
        ch = source[i]
        prev = source[i - 1] if i > 0 else ""

        if in_string:
            if ch == in_string and prev != "\\":
                in_string = None
            i += 1
            continue

        if ch in {"'", '"', "`"}:
            in_string = ch
            i += 1
            continue

        if ch == opening:
            depth += 1
        elif ch == closing:
            depth -= 1
            if depth == 0:
                return source[start_index : i + 1], i + 1

        i += 1

    raise ValueError(f"Unbalanced expression starting at index {start_index}")


def find_balanced_after(regex: re.Pattern[str], source: str) -> tuple[str, str]:
    match = regex.search(source)
    if not match:
        raise ValueError(f"Could not find pattern: {regex.pattern}")

    start = match.end()
    while start < len(source) and source[start].isspace():
        start += 1

    block, _ = extract_balanced(source, start)
    return match.group("name") if "name" in regex.groupindex else "", block


def split_top_level(content: str, separator: str = ",") -> list[str]:
    items: list[str] = []
    start = 0
    depth_curly = depth_square = depth_round = 0
    in_string: str | None = None

    for i, ch in enumerate(content):
        prev = content[i - 1] if i > 0 else ""

        if in_string:
            if ch == in_string and prev != "\\":
                in_string = None
            continue

        if ch in {"'", '"', "`"}:
            in_string = ch
            continue

        if ch == "{":
            depth_curly += 1
        elif ch == "}":
            depth_curly -= 1
        elif ch == "[":
            depth_square += 1
        elif ch == "]":
            depth_square -= 1
        elif ch == "(":
            depth_round += 1
        elif ch == ")":
            depth_round -= 1
        elif (
            ch == separator
            and depth_curly == 0
            and depth_square == 0
            and depth_round == 0
        ):
            part = content[start:i].strip()
            if part:
                items.append(part)
            start = i + 1

    tail = content[start:].strip()
    if tail:
        items.append(tail)

    return items


def split_key_value(entry: str) -> tuple[str, str]:
    depth_curly = depth_square = depth_round = 0
    in_string: str | None = None

    for i, ch in enumerate(entry):
        prev = entry[i - 1] if i > 0 else ""

        if in_string:
            if ch == in_string and prev != "\\":
                in_string = None
            continue

        if ch in {"'", '"', "`"}:
            in_string = ch
            continue

        if ch == "{":
            depth_curly += 1
        elif ch == "}":
            depth_curly -= 1
        elif ch == "[":
            depth_square += 1
        elif ch == "]":
            depth_square -= 1
        elif ch == "(":
            depth_round += 1
        elif ch == ")":
            depth_round -= 1
        elif ch == ":" and depth_curly == 0 and depth_square == 0 and depth_round == 0:
            return entry[:i].strip(), entry[i + 1 :].strip()

    raise ValueError(f"Could not split key/value from entry: {entry}")


def parse_js_string(token: str) -> str:
    token = token.strip()
    if token.startswith(("'", '"')):
        return ast.literal_eval(token)
    if token.startswith("`") and token.endswith("`"):
        inner = token[1:-1]
        return (
            inner.replace("\\`", "`")
            .replace("\\n", "\n")
            .replace("\\t", "\t")
            .replace("\\r", "\r")
        )
    raise ValueError(f"Unsupported string token: {token}")


def parse_value(token: str, *, position_constants: dict[str, Any] | None = None) -> Any:
    token = token.strip().rstrip(",")

    if token in {"true", "false"}:
        return token == "true"
    if token == "null":
        return None
    if re.fullmatch(r"-?\d+(?:\.\d+)?", token):
        return float(token) if "." in token else int(token)
    if token.startswith(("'", '"', "`")):
        return parse_js_string(token)
    if token.startswith("["):
        return parse_array(token, position_constants=position_constants)
    if token.startswith("{"):
        return parse_object(token, position_constants=position_constants)
    if token.startswith("(") or "=>" in token:
        return None
    if position_constants and token in position_constants:
        return position_constants[token]

    return token


def parse_array(block: str, *, position_constants: dict[str, Any] | None = None) -> list[Any]:
    inner = block.strip()[1:-1].strip()
    if not inner:
        return []

    return [
        parse_value(item, position_constants=position_constants)
        for item in split_top_level(inner)
    ]


def parse_object(block: str, *, position_constants: dict[str, Any] | None = None) -> dict[str, Any]:
    inner = block.strip()[1:-1].strip()
    if not inner:
        return {}

    data: dict[str, Any] = {}
    for entry in split_top_level(inner):
        key, value = split_key_value(entry)
        data[key.strip().strip('"').strip("'")] = parse_value(
            value,
            position_constants=position_constants,
        )
    return data


def extract_named_arrays(source: str) -> dict[str, list[dict[str, Any]]]:
    arrays: dict[str, list[dict[str, Any]]] = {}

    for match in CARD_ARRAY_RE.finditer(source):
        start = match.end()
        while start < len(source) and source[start].isspace():
            start += 1
        block, _ = extract_balanced(source, start)
        arrays[match.group("name")] = parse_array(block)

    return arrays


def extract_position_constants(source: str) -> dict[str, list[dict[str, Any]]]:
    constants: dict[str, list[dict[str, Any]]] = {}

    for match in POSITION_CONST_RE.finditer(source):
        start = match.end()
        while start < len(source) and source[start].isspace():
            start += 1
        block, _ = extract_balanced(source, start)
        constants[match.group("name")] = parse_array(block)

    return constants


def extract_spreads(
    source: str,
    position_constants: dict[str, list[dict[str, Any]]],
) -> dict[str, dict[str, Any]]:
    _, block = find_balanced_after(SPREADS_RE, source)
    spreads = parse_object(block, position_constants=position_constants)

    for spread in spreads.values():
        spread.pop("icon", None)

    return spreads


def build_ground_truth(repo_root: Path) -> dict[str, Any]:
    cards_source = strip_js_comments(
        (repo_root / "constants" / "cards.ts").read_text(encoding="utf-8")
    )
    spreads_source = strip_js_comments(
        (repo_root / "constants" / "spreads.tsx").read_text(encoding="utf-8")
    )

    card_arrays = extract_named_arrays(cards_source)
    position_constants = extract_position_constants(spreads_source)
    spreads = extract_spreads(spreads_source, position_constants)

    return normalize_ground_truth(card_arrays, spreads, position_constants)


def normalize_card(card: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(card["id"]),
        "numericId": card["id"],
        "image": card["image"],
        "name": {
            "en": card["nameEn"],
            "zh-CN": card["nameCn"],
        },
        "keywords": {
            "en": card.get("keywordsEn", []),
            "zh-CN": card.get("keywords", []),
        },
        "description": {
            "en": card.get("descriptionEn"),
            "zh-CN": card.get("descriptionCn"),
        },
        "meanings": {
            "upright": {
                "en": card.get("positiveEn"),
                "zh-CN": card.get("positive"),
            },
            "reversed": {
                "en": card.get("negativeEn"),
                "zh-CN": card.get("negative"),
            },
        },
    }


def normalize_spread(spread_id: str, spread: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": spread_id,
        "name": {
            "en": spread["name_en"],
            "zh-CN": spread["name_cn"],
        },
        "description": {
            "en": spread["description_en"],
            "zh-CN": spread["description_cn"],
        },
        "cardCount": spread["cardCount"],
        "layout": {
            "type": spread["layoutType"],
            "offset": spread.get("layoutOffset") or {"x": 0, "y": 0},
            "positions": spread.get("positions"),
            "labels": {
                "en": spread.get("labels_en"),
                "zh-CN": spread.get("labels_cn"),
            },
            "positionLabels": {
                "en": spread.get("positionLabels_en"),
                "zh-CN": spread.get("positionLabels_cn"),
            },
            "cardSize": spread["cardSize"],
        },
        "cardPools": spread.get("cardPools"),
        "interpretationInstruction": {
            "en": spread["interpretationInstruction_en"],
            "zh-CN": spread["interpretationInstruction_cn"],
        },
        "defaultQuestions": {
            "en": spread.get("defaultQuestions_en"),
            "zh-CN": spread.get("defaultQuestions_cn"),
        },
    }


def normalize_ground_truth(
    card_arrays: dict[str, list[dict[str, Any]]],
    spreads: dict[str, dict[str, Any]],
    position_constants: dict[str, list[dict[str, Any]]],
) -> dict[str, Any]:
    major_cards = [normalize_card(card) for card in card_arrays["MAJOR_ARCANA"]]
    minor_cards = [normalize_card(card) for card in card_arrays["MINOR_ARCANA"]]
    all_cards = [*major_cards, *minor_cards]

    cards_by_id = {card["id"]: card for card in all_cards}
    spreads_by_id = {
        spread_id: normalize_spread(spread_id, spread)
        for spread_id, spread in spreads.items()
    }

    return {
        "schemaVersion": 2,
        "cards": {
            "allIds": [card["id"] for card in all_cards],
            "byId": cards_by_id,
            "groups": {
                "majorArcana": [card["id"] for card in major_cards],
                "minorArcana": [card["id"] for card in minor_cards],
                "fullDeck": [card["id"] for card in all_cards],
            },
        },
        "spreads": {
            "allIds": list(spreads_by_id.keys()),
            "byId": spreads_by_id,
        },
        "layouts": {
            "positionPresets": position_constants,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Export tarot cards and spreads into a ground-truth JSON file."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("data/ground-truth.json"),
        help="Path to write the combined JSON data.",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    output_path = repo_root / args.output
    output_path.parent.mkdir(parents=True, exist_ok=True)

    payload = build_ground_truth(repo_root)
    output_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {output_path.relative_to(repo_root)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
