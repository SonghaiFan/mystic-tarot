/**
 * Tarot Card Definitions and Utilities
 *
 * This module draws inspiration from "The Pictorial Key to the Tarot" (1911) by A.E. Waite,
 * illustrated by Pamela Colman Smith. The Tarot, as presented here, is not merely a tool for fortune-telling,
 * but a vessel of profound symbolism and spiritual tradition, reflecting the "higher mystic schools" and
 * the veiled mysteries of divination. Each card is described with an emphasis on its symbolic imagery and
 * deeper meaning, in the spirit of Waite's original text, which sought to rescue the Tarot from mere
 * cartomancy and restore its place as a key to inner wisdom and the "Sanctuary" of the soul.
 *
 * Card images are sourced from local assets for performance and offline support, with a fallback to the
 * Sacred Texts Archive. The descriptions and keywords aim to honor the poetic and esoteric qualities
 * emphasized by Waite, inviting users to contemplate the Tarot as a journey of the spirit, not just a game of chance.
 *
 * Source: The Pictorial Key to the Tarot, by A.E. Waite, ill. by Pamela Colman Smith [1911], public domain (US).
 */

import { TarotCard, CardPoolType } from "../types";

// Base URL for card images
// Using local images stored in public folder for better performance and offline support
const LOCAL_CDN = `${import.meta.env.BASE_URL}images/cards/`;
// Fallback to Sacred Texts Archive if local images are not available
const REMOTE_CDN = "https://www.sacred-texts.com/tarot/pkt/img/";

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    nameEn: "The Fool",
    nameCn: "愚人",
    keywords: ["无限潜力", "新的开始", "赤子之心", "纯真", "自由", "冒险"],
    image: "ar00.jpg",
    description:
      "With a light step and his dog leaping beside him, a youth in gorgeous vestments pauses on the brink of a precipice, rose and wand in hand, as if angels would uphold him. He is the spirit setting out to seek experience—first emanation, passivity and grace stored in the soul.  轻装的青年与跳跃的犬立于悬崖，手持白玫与杖，仿佛天使会托住他的脚步；他是出发寻求体验的灵魂，象征最初的放射、被动与蕴藏的恩典。",
    positive:
      "从零开始; 好赌运; 不墨守成规; 追求新奇的梦想; 冒险; 放浪形骸; 艺术家的气质; 异于常人; 直攻要害、盲点; 爱情狩猎者; 爱情历经沧桑; 不拘形式的自由恋爱",
    negative:
      "不安定; 孤注一掷会失败; 缺乏责任感; 损失; 脚跟站不稳; 堕落; 没发展; 没计划; 走错路; 行为乖张; 轻浮的恋情; 感情忽冷忽热; 不安定的爱情之旅",
  },
  {
    id: 1,
    nameEn: "The Magician",
    nameCn: "魔术师",
    keywords: ["显化", "意志力", "创造", "资源", "专注"],
    image: "ar01.jpg",
    description:
      "A youthful figure with the face of Apollo stands before the four suits; the lemniscate crowns him and a serpent girds his waist. Wand to heaven, hand to earth—he channels grace. Roses and lilies bloom from wild ground. He embodies the divine motive in man, unity on all planes and the power to manifest Spirit.  阿波罗面貌的青年立于四种花色前，头顶无限符号，腰缠蛇带，一手指天一手指地，引下恩典；玫瑰与百合自野地化为花园。他象征人内在的神意、诸界的统一与显化灵恩的力量。",
    positive:
      "好的开始; 具独创性; 有发展的; 新计划成功; 想像力丰富或有好点子; 有恋情发生; 拥有默契良好的伴侣; 有新恋人出现; 值得效仿的对象出现",
    negative:
      "失败; 优柔寡断; 才能平庸; 有被欺诈的危险; 技术不足; 过于消极; 没有判断力; 缺乏创造力; 爱情没有进展",
  },
  {
    id: 2,
    nameEn: "The High Priestess",
    nameCn: "女祭司",
    keywords: ["直觉", "潜意识", "神秘", "内在智慧", "静默"],
    image: "ar02.jpg",
    description:
      "She sits between the white and black pillars, crescent at her feet, horned crown and globe above. A solar cross rests on her breast; the veiled scroll Tora lies in her hands before the temple veil of palms and pomegranates. She is the Secret Tradition—the invisible Church, bride and mother by borrowed light—guarding what is hinted and withheld.  她端坐于黑白之柱之间，足踏新月，头戴角冠与球体，胸前日十字，手持半遮的“Tora”卷轴，身后是绣有棕榈与石榴的殿幔。她是隐秘传统、无形之教会，以借来的光为新娘与母亲，守护暗示与隐匿之知。",
    positive:
      "知性、优秀的判断力; 具洞察力及先见之明; 强大的战斗意志; 冷静的统率力; 学问、研究等精神方面幸运; 独立自主的女性; 柏拉图式的爱情; 有心灵上交往至深的友人; 冷淡的恋情",
    negative:
      "无知、缺乏理解力; 研究不足; 不理性的态度; 自我封闭; 神经质; 洁癖; 与女性朋友柒争执; 对人冷淡; 晚婚或独身主义; 没有结果的单相思; 气色不好; 不孕",
  },
  {
    id: 3,
    nameEn: "The Empress",
    nameCn: "皇后",
    keywords: ["丰饶", "自然", "母性", "感官享受", "孕育"],
    image: "ar03.jpg",
    description:
      "Amid wheat and waterfall a stately figure sits, crowned with twelve stars, scepter with globe in hand; the Venus shield marks her as Earth Mother, the lower Eden. She is prolific, the outer word without its interpretation—shelter of sinners yet not spouse of the Holy King.  在麦穗与瀑流之间，威仪的女主戴十二星冠，手执地球仪权杖，维纳斯盾牌彰显她为大地之母、下界乐园。她孕育万物、是外在之言但未含解读，庇护罪人却非圣王之配。",
    positive:
      "母性本能强; 富创造力; 事业有成; 生活富足; 感情充实; 美好的恋情; 受人爱戴的对象; 有结婚的机会; 温柔体贴的伴侣",
    negative:
      "缺乏母性本能; 创造力不足; 生活贫困; 事业不顺; 感情不满; 难以取悦的对象; 难以结婚; 冷淡的伴侣",
  },
  {
    id: 4,
    nameEn: "The Emperor",
    nameCn: "皇帝",
    keywords: ["权威", "结构", "控制", "父亲原型", "秩序"],
    image: "ar04.jpg",
    description:
      "A crowned monarch on a ram-carved stone throne holds orb and cross-like scepter. He is executive power, realized authority of this world, the masculine counterpart seeking to lift Isis’ veil. He is the householder of the material sphere.  戴冠君主坐于羊首石座，手持宝球与十字权杖，象征尘世高贵的执行与权威，是欲揭开伊西斯面纱的阳性力量，也是物质世界的家主。",
    positive:
      "以坚强的意志力及手腕获致成功; 富裕和力量; 有责任感; 良好的处理能力; 具领导能力; 男性的思考; 坚持到底; 虽有点专制却值得信赖; 条件诱人的提亲; 与年长者恋爱",
    negative:
      "不成熟; 意志薄弱; 虚有其表; 看不清现实; 欠缺实务能力; 因傲慢而招人反感; 工作过度; 固执; 没有经济基础; 没有好对象; 苦恋结束; 勉强的感情",
  },
  {
    id: 5,
    nameEn: "The Hierophant",
    nameCn: "教皇",
    keywords: ["传统", "信仰", "教导", "社会规范", "精神指引"],
    image: "ar05.jpg",
    description:
      "Wearing the triple crown, he sits between pillars other than the Priestess’s. Triple cross in one hand, blessing sign in the other, keys at his feet, ministers kneeling. He rules exoteric religion as spiritual father; the Priestess holds the hidden tradition.  他戴三重冠坐于两柱间，手持三重十字并行祝福手势，脚边交叉钥匙，侍者跪前。他是外显宗教的统摄与灵性之父，而隐秘传统则在女祭司手中。",
    positive:
      "受人信赖; 有贵人相助; 贡献; 受上司重视; 能胜任工作; 拥有一颗温柔的心; 受惠于有益的建言; 接触宗教的事物大吉; 与年长的异性有缘; 良缘; 深情宽大的爱; 有结良缘的机会",
    negative:
      "没信用; 没有贵人相助; 孤立无援; 不受欢迎的好意; 依赖心是最大的敌人; 太罗嗦而讨人厌; 碍于私情而无法成功; 心胸狭窄; 得不到亲人的谅解的恋情; 彼此过于关心; 缘分浅薄的恋情",
  },
  {
    id: 6,
    nameEn: "The Lovers",
    nameCn: "恋人",
    keywords: ["爱", "和谐", "价值观", "选择", "结合"],
    image: "ar06.jpg",
    description:
      "A great winged figure shines above the man and woman; behind them stand the Tree of Life with twelve fruits and the serpent-twined Tree of Knowledge. They are youth, innocence and first love without shame. The card is the simple, sacred mystery of love—the way, the truth and the life—hinting at covenant and Sabbath.  光辉有翼者悬于男女之上，身后生命树结十二果，知识之树缠绕蛇形；二人象征无羞的青春与初恋。此牌是爱的神圣奥秘，亦暗示盟约与安息。",
    positive:
      "幸运的结合; 有希望的将来; 有共同做事的伙伴; 与人合作或社团活动; 敏感决定前进之路的好时机; 有意气相投的朋友; 爱情机会将到来; 罗曼蒂克的恋情; 爱的预感",
    negative:
      "分离; 消解; 不合作的态度; 眼花缭乱; 没有满意的成果; 无法持续; 退休; 妨碍; 血气方刚; 多情的人; 分手; 冷漠的爱; 背信; 逃避爱情; 短暂的恋情",
  },
  {
    id: 7,
    nameEn: "The Chariot",
    nameCn: "战车",
    keywords: ["意志力", "胜利", "决心", "自我掌控", "进取"],
    image: "ar07.jpg",
    description:
      "A victorious prince in his chariot bears sword and shoulder emblems; two sphinxes draw him. He has conquered on visible planes—science, progress, outer trials—but not within the sanctuary. He cannot open the Priestess’s scroll. This is worldly triumph, not that of the Spirit.  凯旋的王子执剑立于战车，肩饰符号，车由双狮身人面像牵引；他征服外在领域与试炼，却无法开启女祭司的经卷。此乃世俗胜利，非灵性的凯歌。",
    positive:
      "前进必胜; 先下手为强; 独立; 起程; 在颠簸中仍有好成绩; 活泼; 有野心; 以速度取胜; 有开拓精神; 握有指挥权; 战胜敌手; 富行动力的恋情; 恋爱的胜利者",
    negative:
      "失败; 丧失战斗意志; 状态不佳; 挫折; 性子过急为失败之因; 不感兴趣; 效率不佳; 资金运转困难; 无奋斗精神; 有强劲敌手进入; 被拒绝; 因怯懦而使恋情不顺",
  },
  {
    id: 8,
    nameEn: "Strength",
    nameCn: "力量",
    keywords: ["勇气", "耐心", "同情", "内在力量", "驯服"],
    image: "ar08.jpg",
    description:
      "A lady crowned with the lemniscate closes a lion’s jaws with a garland leash. Mercy steadies passion; the flowers suggest the sweet yoke of Divine Law in the heart. Strength is faith finding refuge in God, not self-assertion—the animal nature subject to higher love.  头戴无限符号的女子以花环缰绳合上狮口，慈爱制服激情，花朵暗示铭心的神圣轭。这里的力量是投靠于神的信心，而非自我逞强；兽性因至高的爱而驯服。",
    positive:
      "不屈不挠的精神; 将不可能化为可能的意志力; 全力以赴; 突破难关; 坚强的信念和努力; 挑战已知危险的勇气; 神秘的力量; 旺盛的斗志; 轰轰烈烈的恋情; 克服困难的真实爱情",
    negative:
      "疑心病; 犹豫不决; 实力不足; 无忍耐力; 危险的赌注; 勉强为之而适得其反; 丧失自信; 喜欢故弄玄虚; 体力不足; 自大自负; 误用力气",
  },
  {
    id: 9,
    nameEn: "The Hermit",
    nameCn: "隐士",
    keywords: ["内省", "孤独", "寻求真理", "指引", "撤退"],
    image: "ar09.jpg",
    description:
      "An aged figure on a height lifts a lantern with a star and bears a staff. The unveiled lamp proclaims attainment—where I am, you may come. He is no recluse hoarding power but a sage lighting the way; the mysteries guard themselves, and his silence is realized wisdom.  老者立于高处，高举星光灯笼，手持杖，灯不被遮掩，昭示“我所在处你亦可至”。他非闭关自守者，而是已达巅峰、为他人照亮的智者；奥秘自护，他的沉默是已然的觉悟。",
    positive:
      "智能与卓越见解; 不断地追求更高层次的东西; 思虑周密; 冷静沉着; 不多言; 接触知性事物吉; 正中核心的建言; 活动慢慢进行较有成果; 出局; 追求柏拉图式的爱情; 暗中的爱情",
    negative:
      "一视同仁; 不够通融; 不专心易生错误; 过分警戒,无法顺利进行; 秘密泄漏; 过于固执不听别人的意见; 孤独; 动机不单纯; 因怨言及偏   见招人嫌; 轻浮的爱情; 怀疑爱情",
  },
  {
    id: 10,
    nameEn: "Wheel of Fortune",
    nameCn: "命运之轮",
    keywords: ["宿命", "转折点", "周期", "运气", "改变"],
    image: "ar10.jpg",
    description:
      "The wheel marked ROTA and the Divine Name turns between Typhon descending and Anubis rising, a sphinx atop; Ezekiel’s winged creatures watch from the corners. It shows perpetual flux with balance at center—denying chance, pointing to hidden law.  刻有ROTA与圣名的轮子在堕落的巨蛇与上升的阿努比斯之间旋转，斯芬克斯居其上，以西结的四生灵守于四角。象征万物流变中的中枢平衡，否定偶然，指向命运的隐秘法则。",
    positive:
      "机会到来; 随机应变能力佳; 好运; 转换期; 意想不到的幸运; 升迁有望; 变化丰富; 好时机; 宿命的相逢; 一见钟情; 幸运的婚姻; 富贵的身份",
    negative:
      "低潮期; 时机未到; 评估易出错; 时机不好; 没有头绪; 处于劣势; 生活艰苦; 情况恶化; 计划停滞需要再等待; 失恋; 短暂的恋情; 易错失良机; 不敌诱惑; 爱情无法持久",
  },
  {
    id: 11,
    nameEn: "Justice",
    nameCn: "正义",
    keywords: ["公平", "真理", "因果", "法律", "平衡"],
    image: "ar11.jpg",
    description:
      "Between pillars she holds raised sword and scales. Justice deals to each according to works—a law akin to higher things yet distinct from the mystery of grace. Her pillars open to one world; the Priestess’s to another.  她在双柱间执剑与天平，按行为而分配的律法与更高之事相类，却有别于任意吹拂的恩典。她的柱子通向此界，女祭司的柱子通向彼界。",
    positive:
      "公正; 严正的意见; 良好的均衡关系; 严守中立立场; 凡事合理化; 身兼两种工作; 协调者; 与裁判、法律相关者; 表里一致的公正人物; 以诚实之心光明正大地交往; 彼此能获得协调",
    negative:
      "不公正; 不平衡; 不利的条件; 偏颇; 先入为主的观念; 偏见与独断; 纷争、诉讼; 问心有愧; 无法两全; 天平两边无法平衡; 性格不一致; 无视于社会道德观的恋情; 偏爱",
  },
  {
    id: 12,
    nameEn: "The Hanged Man",
    nameCn: "倒吊人",
    keywords: ["牺牲", "等待", "新视角", "放下", "暂停"],
    image: "ar12.jpg",
    description:
      "Hung by one foot from a living tau tree, legs forming a cross, nimbus about his calm face—the scene is suspended, living sacrifice. It veils the relation of Divine and universe, hinting at awakening and resurrection; not mere martyrdom or prudence.  他单脚悬于活的T字树上，双腿成十字，神情安宁，光环围绕，呈现的是悬而未绝的奉献。牌中遮掩着神与宇宙的关联，暗示觉醒与复活，并非单纯的殉道或谨慎。",
    positive:
      "接受考验; 无法动弹; 被牺牲; 有失必有得; 从痛苦的体验中获得教训; 过度期; 不贪图眼前利益; 浴火重生; 多方学习; 奉献的爱; 明知辛苦但全力以赴",
    negative:
      "无谓的牺牲; 折断骨头; 有噩运、居于劣势; 任性妄为; 不努力; 变得没有耐性; 利己主义者; 受到惩罚; 无偿的爱; 缺乏共同奋斗的伙伴",
  },
  {
    id: 13,
    nameEn: "Death",
    nameCn: "死神",
    keywords: ["结束", "重生", "转变", "必然性", "过渡"],
    image: "ar13.jpg",
    description:
      "A skeletal rider bears a black banner with the mystic rose; king, child and maiden fallen, a bishop awaiting. The sun of immortality rises between pillars. It is transformation and passage from lower to higher, touching the mystery of inner death in life.  骷髅骑士举着绣有神秘玫瑰的黑旗前行，国王、孩童与少女已倒，主教正待其至；地平线两柱间升起不朽之日。此牌象征由低至高的转化，触及生命中神秘的内在之死。",
    positive:
      "失败; 毁灭之日将近; 损害继续延续; 失业; 进展停滞; 交易停止; 为时已晚; 停滞状态; 生病或意外的暗示; 味如嚼蜡的生活; 不幸的恋情; 恋情终止; 彼此间有很深的鸿沟; 别离",
    negative:
      "起死回生的机会; 脱离低迷期; 改变印象; 回心转意再出发; 挽回名誉; 奇迹似地康复; 突然改变方针; 已经死心的   事有了转机; 斩断情丝,重新出发",
  },
  {
    id: 14,
    nameEn: "Temperance",
    nameCn: "节制",
    keywords: ["平衡", "温和", "调和", "耐心", "炼金术"],
    image: "ar14.jpg",
    description:
      "A winged angel, solar sign on the brow, pours life’s essence between cups, one foot on land, one on water; a path leads to a distant crown of light. Beyond season symbols, neither male nor female, Temperance blends psychic and material natures—likeness of Spirit’s inflow.  翼天使额带日徽，一足陆一足水，将生命之液在双杯间流转，小径通向远处光冠。无季节标记、超越雌雄，节制调和心性与物质，象征灵流的灌注。",
    positive:
      "单纯化; 顺畅; 交往平顺; 两者相融顺畅; 调整; 彼此交换有利条件; 平凡中也有重要的契机; 平顺的心境; 纯爱; 从好感转为爱意; 深爱",
    negative:
      "消耗; 每节制的损耗,对身心产生不好的影响; 疲劳; 不定性的工作; 缺乏调整能力; 下降; 浪费; 不要与人 合作; 不融洽; 爱情的配合度不佳",
  },
  {
    id: 15,
    nameEn: "The Devil",
    nameCn: "恶魔",
    keywords: ["束缚", "物质主义", "诱惑", "阴影", "成瘾"],
    image: "ar15.jpg",
    description:
      "The horned goat of Mendes, bat-winged, stands on an altar, inverted pentagram on brow, torch reversed. Man and woman, tailed and chained, recall the Hierophant’s pair after the Fall. He is bondage to matter and false desire—himself a slave upheld by followers’ evil—guardian of the false Eden, not secret wisdom.  蝙蝠翼的山羊头立于祭坛，额饰倒五芒星，手持倒火炬，身前的男女带尾被链，仿佛堕落后的教皇牌人物。他象征物欲的桎梏与虚妄欲望的暴政，自身亦被追随者的邪恶所缚，是伪伊甸的守门人，而非隐秘智慧的象形。",
    positive:
      "被束缚; 堕落; 恶魔的私语; 卑躬屈膝; 欲望的俘虏; 荒废的生活; 举债度日; 病魔入侵; 夜游过多; 不可告人的事; 恶意; 不可抗拒的诱惑; 私密恋情; 沉溺于感官刺激之下",
    negative:
      "逃离拘束; 长期的苦恼获得解放; 斩断前缘; 越过难关; 暂时停止; 拒绝诱惑; 舍弃私欲; 治愈长期病痛; 别离   时刻; 如深陷泥沼爱恨交加的恋情",
  },
  {
    id: 16,
    nameEn: "The Tower",
    nameCn: "高塔",
    keywords: ["剧变", "启示", "破坏", "觉醒", "混乱"],
    image: "ar16.jpg",
    description:
      "Lightning smites a crowned tower; fire bursts forth, two figures fall headlong. The house falls because the Lord did not build it—the false edifice rent. It may be ruin of a house of doctrine or proud intellect, the close of a cycle and collapse of what cannot stand.  闪电击碎戴冠高塔，火焰迸出，二人倒坠。房屋因非主所建而毁，象征虚假殿堂的撕裂；可指邪恶当道时教义之屋的崩塌，或傲慢智识的覆灭，也预示周期终结与不堪的瓦解。",
    positive:
      "致命的打击; 纷争; 纠纷不断; 与周遭事物对立,情况恶化; 意想不到的事情; 急病; 受牵连; 急剧的大变动; 信念奔溃; 逆境; 破产; 没有预警,突然分离; 破灭的爱; 玩火自焚",
    negative:
      "紧迫的状态; 险恶的气氛; 内讧; 即将破灭; 急需解决的问题; 承受震撼; 背水一战; 注意刑事问题; 因骄傲自大将付出惨痛的代价; 状况不佳; 困境; 爱情危机; 分离的预感",
  },
  {
    id: 17,
    nameEn: "The Star",
    nameCn: "星星",
    keywords: ["希望", "灵感", "宁静", "疗愈", "更新"],
    image: "ar17.jpg",
    description:
      "A naked maiden kneels by land and water, pouring living water from two vessels; a mound with tree and bird rises behind. Above shines a great eight-rayed star ringed by seven lesser. It is youth, beauty, revealed truth and Spirit’s water freely given—hope and inner light, Binah of the Kabalah.  赤裸的少女跪于陆水之间，将生命之水自双壶倾注，身后土丘有树与鸟；上方一颗八芒巨星环绕七星。此牌象征青春、美与真理的显露，灵水自由给予，是希望与内在之光，对应卡巴拉的理解之母。",
    positive:
      "愿望达成; 前途光明; 充满希望的未来; 美好的生活; 曙光出现; 大胆的幻想; 水准提高; 新的创造力; 想像力; 理想的对象; 美好的恋情; 爱苗滋生",
    negative:
      "挫折、失败; 理想过高; 缺乏想像力; 异想天开; 事与愿违; 失望; 从事不喜欢的工作; 好高骛远; 情况悲观; 不可期待的对象; 没 有爱的生活; 秘密恋情; 仓皇失措",
  },
  {
    id: 18,
    nameEn: "The Moon",
    nameCn: "月亮",
    keywords: ["幻觉", "潜意识", "不安", "梦境", "直觉"],
    image: "ar18.jpg",
    description:
      "The waxing moon of mercy sheds drops of light; a path between two towers leads into the unknown. Dog and wolf howl, a crayfish crawls from the pool. Reflected intellect stirs animal fears; beyond lies the unseen abyss. Be still—let lower nature quiet and the shapes sink back.  渐盈的月洒下光滴，小径穿过双塔通往未知；狗与狼长嚎，螯虾自水而出。反射之智唤醒兽性的恐惧，光外是不可见的深渊。讯息是安静，让下层本性平息，深处之影自会退去。",
    positive:
      "不安与动摇; 心中不平静; 谎言; 暧昧不明; 鬼迷心窍; 暗藏动乱; 欺骗; 终止; 不安的爱; 三角关系",
    negative:
      "从危险的骗局中逃脱; 状况稍为好转; 误会冰释; 破除迷惘; 时间能解决一切; 眼光要长远; 静观等待; 早期发现早期治疗有效; 事前察知危险; 对虚情假意的恋情已不在乎",
  },
  {
    id: 19,
    nameEn: "The Sun",
    nameCn: "太阳",
    keywords: ["快乐", "成功", "活力", "清晰", "温暖"],
    image: "ar19.jpg",
    description:
      "A radiant sun shines over sunflowers as a naked child rides a white horse with scarlet banner. It marks the restored world and passage from reflected moonlight to true Spirit. Innocence is wisdom and simplicity—the child of the new Adam—great light leading humanity home.  灿日照耀向日葵墙，裸童骑白马持红旗前行，象征复原的世界与由反射月光迈向灵性真光；此处的纯真即智慧与单纯，新的亚当之子，引领人类归途的圣光。",
    positive:
      "丰富的生命力; 巨大的成就感; 人际关系非常好; 爱情美满; 内心充满了热情和力量; 一定能够实现的约定; 飞黄腾达; 无忧无虑",
    negative:
      "情绪低落; 事情失败; 朋友的离去和人际关系的恶化; 无法安定内心; 忧郁孤单寂寞; 爱情不顺 利; 取消的计划; 工作上困难重重",
  },
  {
    id: 20,
    nameEn: "Judgement",
    nameCn: "审判",
    keywords: ["觉醒", "反思", "重生", "召唤", "赦免"],
    image: "ar20.jpg",
    description:
      "A great angel in clouds blows the cross-marked trumpet as dead rise—man, woman, child and more—faces filled with wonder. It records the completed work of transmutation answering the Supernal call within, hinting at the inner trumpet that awakens lower nature: a card of eternal life.  大天使于云间吹响带十字旗的号角，亡者—男女孩童与众人—出墓而起，神情惊喜。此牌记录回应至高召唤的炼化完成，也暗指内在号角瞬间唤醒下层本性，是永生的象征。",
    positive:
      "复活的喜悦; 开运; 公开; 改革期; 危机解除; 决断; 荣升; 崭露头角; 好消息; 爱的使者; 恢复健康; 坦白; 复苏的爱; 再会; 爱的奇迹",
    negative:
      "一败不起; 幻灭; 离复苏还有很长的时间; 不利的决定; 不被采用; 还未开始就结束了; 坏消息; 延期; 无法决定; 虽重新开始,却又恢复原状; 分离、消除; 恋恋不舍",
  },
  {
    id: 21,
    nameEn: "The World",
    nameCn: "世界",
    keywords: ["圆满", "完成", "旅行", "成就", "整体"],
    image: "ar21.jpg",
    description:
      "A wreath encloses a dancing figure with two wands; Ezekiel’s four living creatures fill the corners. It is the perfection and consummation of the cosmos, the soul in divine vision, the joy when all was declared good. Not the absolute nor the Magus crowned.  花环环绕舞动的披纱之人双持权杖，四角列以西结的四生灵。此牌象征宇宙的圆满与终结、灵魂处于神圣观照中的喜悦，回响“万物皆善”之日，并非绝对或登顶的魔术师。",
    positive:
      "完成; 成功; 拥有毕生的志业; 达成目标; 永续不断; 最盛期; 完美无缺; 接触异国,将获得幸运; 到达标准; 精神亢奋; 快乐的结束; 模范情侣",
    negative:
      "未完成; 无法达到计划中的成就; 因准备不足而失败; 中途无法在进行; 不完全燃烧; 一时不顺利; 饱和状态; 烦恼延续; 精神松弛; 个人惯用的表现方式; 因不成熟而 使情感受挫; 合谋; 态度不够圆融",
  },
];

// Specific definitions for the 56 Minor Arcana cards
export const MINOR_ARCANA: TarotCard[] = [
  // --- WANDS (Fire / Action) ---
  {
    id: 22,
    nameEn: "Ace of Wands",
    nameCn: "权杖首牌",
    keywords: ["灵感", "新机会", "创造力", "潜力"],
    image: "waac.jpg",
    description:
      "A hand issues from the clouds holding a sprouting wand—the raw spark of creation, enterprise and virility at the start.  云间伸出之手握着发芽的权杖，象征创生的火种、冒险的冲动与起点的生命力。",
  },
  {
    id: 23,
    nameEn: "Two of Wands",
    nameCn: "权杖二",
    keywords: ["未来规划", "决定", "发现", "掌控"],
    image: "wa02.jpg",
    description:
      "A lord on a battlement holds a globe and looks over land and sea—command of dominion shadowed by unrest and choice.  城垛上的贵族手持地球仪眺望海陆，既有权势与远景，也有坐拥天下仍心怀不安的抉择。",
  },
  {
    id: 24,
    nameEn: "Three of Wands",
    nameCn: "权杖三",
    keywords: ["扩张", "远见", "海外", "进步"],
    image: "wa03.jpg",
    description:
      "A merchant prince watches his ships from a high shore—enterprise launched, aid and cooperation on the horizon.  商旅立于高岸眺望远航的船队，事业已启程，合作与拓展正在前方到来。",
  },
  {
    id: 25,
    nameEn: "Four of Wands",
    nameCn: "权杖四",
    keywords: ["庆祝", "和谐", "回家", "安稳"],
    image: "wa04.jpg",
    description:
      "Garlands hang between four wands; figures celebrate by a bridge before a manor—homecoming, repose and harmonious prosperity.  花环悬于四根权杖之间，庆典在桥畔与庄园前展开，象征归家、安逸与和乐的收成。",
  },
  {
    id: 26,
    nameEn: "Five of Wands",
    nameCn: "权杖五",
    keywords: ["冲突", "竞争", "分歧", "挑战"],
    image: "wa05.jpg",
    description:
      "Youths brandish staves in mimic strife—a contest of wills, rivalry and the mock battle of ambition.  少年舞动权杖嬉戏又似争斗，表现竞争、较量与为目标而起的练兵。",
  },
  {
    id: 27,
    nameEn: "Six of Wands",
    nameCn: "权杖六",
    keywords: ["胜利", "认可", "自信", "成就"],
    image: "wa06.jpg",
    description:
      "A laurelled rider bears a crowned staff amid attendants—public victory, awaited news and hope fulfilled.  戴桂冠的骑士举着花冠权杖穿行人群，象征凯旋、捷报以及愿望的实现。",
  },
  {
    id: 28,
    nameEn: "Seven of Wands",
    nameCn: "权杖七",
    keywords: ["防御", "坚持", "挑战", "勇气"],
    image: "wa07.jpg",
    description:
      "From a height one defends against six rising staves—valor with the vantage ground, debate and competition resisted.  立于高处者挥杖抵御下方六杖，象征据险固守的勇气、辩驳与竞争中的坚持。",
  },
  {
    id: 29,
    nameEn: "Eight of Wands",
    nameCn: "权杖八",
    keywords: ["速度", "行动", "消息", "快速变化"],
    image: "wa08.jpg",
    description:
      "Eight wands fly across open country—movement through the immovable, swift messages and imminent arrival.  八根权杖划空而行，表示迅疾的进展、讯息飞至与即将到来的结果。",
  },
  {
    id: 30,
    nameEn: "Nine of Wands",
    nameCn: "权杖九",
    keywords: ["韧性", "防御", "最后坚持", "疲惫"],
    image: "wa09.jpg",
    description:
      "A wary figure leans on his staff before a palisade—strength in opposition, readiness to meet the next onslaught.  戒备的守卫倚杖立于栅栏前，象征逆境中的坚守与迎击来犯的准备。",
  },
  {
    id: 31,
    nameEn: "Ten of Wands",
    nameCn: "权杖十",
    keywords: ["负担", "责任", "压力", "努力"],
    image: "wa10.jpg",
    description:
      "A man staggers beneath ten staves—oppression by success, burdens of gain and the strain of disguises.  男子弯身扛起十根权杖，显示成就与财富所带来的沉重负担与压力。",
  },
  {
    id: 32,
    nameEn: "Page of Wands",
    nameCn: "权杖侍从",
    keywords: ["探索", "新想法", "热情", "自由"],
    image: "wapa.jpg",
    description:
      "A youthful herald proclaims with wand in hand—faithful messenger, strange tidings and family news.  年轻的传令官举杖宣告，象征忠诚的信使、陌生但重要的消息与家族讯息。",
  },
  {
    id: 33,
    nameEn: "Knight of Wands",
    nameCn: "权杖骑士",
    keywords: ["冲动", "激情", "行动", "冒险"],
    image: "wakn.jpg",
    description:
      "An armored rider presses forward with a short wand—departure, change of place and the precipitate mood.  披甲骑士执杖飞奔，代表启程、搬迁与冲动的行动力。",
  },
  {
    id: 34,
    nameEn: "Queen of Wands",
    nameCn: "权杖王后",
    keywords: ["自信", "独立", "社交", "活力"],
    image: "waqu.jpg",
    description:
      "The Queen of flowering wands, magnetic and warm, sits with a lion symbol—kind yet ardent, success in dealings and business charm.  手握开花权杖的王后，带着狮子徽记，温暖而有磁性，象征友善、热情与事业上的吸引力。",
  },
  {
    id: 35,
    nameEn: "King of Wands",
    nameCn: "权杖国王",
    keywords: ["领导", "远见", "企业家", "荣誉"],
    image: "waki.jpg",
    description:
      "A noble King uplifts a flowering wand, the lion upon his throne—ardent, honest rulership and news of heritage.  高举开花权杖的国王坐于狮饰王座，体现热烈正直的领导力，也预示传承与消息。",
  },

  // --- CUPS (Water / Emotion) ---
  {
    id: 36,
    nameEn: "Ace of Cups",
    nameCn: "圣杯首牌",
    keywords: ["新感情", "同情", "创造力", "灵性"],
    image: "cuac.jpg",
    description:
      "From the cloud a hand holds an overflowing Cup with dove and four streams—the house of the true heart, joy and divine nourishment.  云间之手托起满溢的圣杯，鸽子与四道水流倾注，象征真心之屋、喜悦与灵性的滋养。",
  },
  {
    id: 37,
    nameEn: "Two of Cups",
    nameCn: "圣杯二",
    keywords: ["伴侣", "结合", "吸引", "平等"],
    image: "cu02.jpg",
    description:
      "Youth and maiden pledge each other as the caduceus rises with a lion’s head—union, passion and harmony that sanctify nature.  青年与少女举杯相对，杖翼与狮头升起，象征结合、热情以及使自然神圣化的和谐之爱。",
  },
  {
    id: 38,
    nameEn: "Three of Cups",
    nameCn: "圣杯三",
    keywords: ["友谊", "社群", "聚会", "快乐"],
    image: "cu03.jpg",
    description:
      "Three maidens uplift cups in a garden—happy conclusion, plenty, merriment and healing companionship.  花园中的三位少女举杯同庆，寓意圆满的结果、丰盛与疗愈的欢聚。",
  },
  {
    id: 39,
    nameEn: "Four of Cups",
    nameCn: "圣杯四",
    keywords: ["冷漠", "沉思", "错失机会", "厌倦"],
    image: "cu04.jpg",
    description:
      "A youth broods under a tree before three cups; a fourth is offered from a cloud—weariness and satiety while a fresh gift goes unseen.  少年在树下凝望三只酒杯，云间递出第四杯，他却无动于衷，象征厌倦之中忽略的新契机。",
  },
  {
    id: 40,
    nameEn: "Five of Cups",
    nameCn: "圣杯五",
    keywords: ["悲伤", "失望", "遗憾", "丧失"],
    image: "cu05.jpg",
    description:
      "Cloaked figure laments three fallen cups while two remain; a bridge leads to a keep—loss mingled with what endures.  披袍人哀叹倒下的三杯，身后仍有两杯完好，桥通堡垒，暗示失去与保留并存。",
  },
  {
    id: 41,
    nameEn: "Six of Cups",
    nameCn: "圣杯六",
    keywords: ["怀旧", "童年", "纯真", "重逢"],
    image: "cu06.jpg",
    description:
      "Children in an old garden fill cups with flowers—memories and happiness from the past, or innocence meeting new surroundings.  古园中孩童将鲜花放入杯中，象征过往的回忆与喜悦，也可指以童真目光迎向新环境。",
  },
  {
    id: 42,
    nameEn: "Seven of Cups",
    nameCn: "圣杯七",
    keywords: ["幻觉", "选择", "白日梦", "困惑"],
    image: "cu07.jpg",
    description:
      "Fantastical chalices brim with visions—reflection, sentiment and tempting phantoms without lasting substance.  七只杯中浮现奇异幻象，代表感性想象与镜中虚影，诱惑却难以持久。",
  },
  {
    id: 43,
    nameEn: "Eight of Cups",
    nameCn: "圣杯八",
    keywords: ["离开", "寻找", "放弃", "旅行"],
    image: "cu08.jpg",
    description:
      "A figure leaves eight cups behind—decline of a matter or the choice to abandon former concerns for another quest.  行者转身离开八只酒杯，寓意事务的式微，或主动放手旧事去追寻新方向。",
  },
  {
    id: 44,
    nameEn: "Nine of Cups",
    nameCn: "圣杯九",
    keywords: ["满足", "愿望成真", "感激", "享受"],
    image: "cu09.jpg",
    description:
      "A content host sits before a row of cups—concord, satisfaction and success enjoyed with future provision implied.  心满意足的主人端坐杯阵之前，象征和谐、满足与已经收获的成功，也暗含后续的保障。",
  },
  {
    id: 45,
    nameEn: "Ten of Cups",
    nameCn: "圣杯十",
    keywords: ["和谐", "幸福", "家庭", "团圆"],
    image: "cu10.jpg",
    description:
      "A rainbow of cups arches above a rejoicing family and their home—perfection of love, friendship and heart’s repose.  彩虹杯悬于欢乐家人与居所之上，寓意圆满的爱情、友谊与内心的安息。",
  },
  {
    id: 46,
    nameEn: "Page of Cups",
    nameCn: "圣杯侍从",
    keywords: ["直觉", "创意", "新消息", "敏感"],
    image: "cupa.jpg",
    description:
      "A thoughtful youth watches a fish rise from his cup—imagination taking form, messages and reflective service.  沉思的侍从望向杯中跃鱼，象征化想为形的创意、讯息以及专注的助力。",
  },
  {
    id: 47,
    nameEn: "Knight of Cups",
    nameCn: "圣杯骑士",
    keywords: ["浪漫", "魅力", "想象力", "追求"],
    image: "cukn.jpg",
    description:
      "A graceful rider with winged helmet advances quietly—arrival or invitation colored by dream and feeling.  戴翼盔的优雅骑士安然前行，代表带着梦幻与情感色彩的来访、提案或邀约。",
  },
  {
    id: 48,
    nameEn: "Queen of Cups",
    nameCn: "圣杯王后",
    keywords: ["慈悲", "关怀", "情感", "直觉"],
    image: "cuqu.jpg",
    description:
      "Dreamy yet active, she contemplates her cup—loving intelligence, devoted service and the vision of a perfect spouse and mother.  温柔而行动的王后凝望圣杯，象征关爱的智慧、奉献之心与理想伴侣、慈母的形象。",
  },
  {
    id: 49,
    nameEn: "King of Cups",
    nameCn: "圣杯国王",
    keywords: ["情绪平衡", "控制", "宽容", "外交"],
    image: "cuki.jpg",
    description:
      "Upon the sea-set throne he holds cup and scepter—equitable, artistic, responsible and calm in creative intelligence.  坐于海上宝座的国王握杯持杖，代表公平、艺术性与负责任的平静智慧。",
  },

  // --- SWORDS (Air / Intellect) ---
  {
    id: 50,
    nameEn: "Ace of Swords",
    nameCn: "宝剑首牌",
    keywords: ["突破", "清晰", "真理", "决断"],
    image: "swac.jpg",
    description:
      "A hand from the cloud raises a crowned sword—triumph of force and incisive clarity, a great power for love or for hate.  云间之手举起戴冠之剑，象征力量与锐利真相的胜利，这份巨大力量可成爱也可成恨。",
  },
  {
    id: 51,
    nameEn: "Two of Swords",
    nameCn: "宝剑二",
    keywords: ["僵局", "艰难决定", "回避", "权衡"],
    image: "sw02.jpg",
    description:
      "Blindfolded figure balances two swords—equipoise, guarded harmony and the need for courageous choice amid arms.  蒙眼者肩扛双剑保持平衡，寓意谨慎的和谐与需在对峙中做出的勇敢抉择。",
  },
  {
    id: 52,
    nameEn: "Three of Swords",
    nameCn: "宝剑三",
    keywords: ["心碎", "悲伤", "痛苦", "分离"],
    image: "sw03.jpg",
    description:
      "Three swords pierce a heart against cloud and rain—absence, division and the sorrow that needs no further words.  三把利剑穿心，阴云雨幕为背景，象征分离、缺席与不言自明的哀痛。",
  },
  {
    id: 53,
    nameEn: "Four of Swords",
    nameCn: "宝剑四",
    keywords: ["休息", "恢复", "沉思", "被动"],
    image: "sw04.jpg",
    description:
      "The effigy of a knight lies in prayer upon a tomb—vigilance in retreat, solitude, hermit’s repose and suspended action.  骑士石像平卧祈祷于墓上，代表退隐中的警觉、独处与暂停行动的休养。",
  },
  {
    id: 54,
    nameEn: "Five of Swords",
    nameCn: "宝剑五",
    keywords: ["失败", "背叛", "冲突", "空虚的胜利"],
    image: "sw05.jpg",
    description:
      "A disdainful victor gathers swords as others retreat—hollow mastery, dishonor and the sting of conflict.  轻蔑的胜利者收起宝剑，败者远去，象征空洞的占有、耻辱与冲突的痛感。",
  },
  {
    id: 55,
    nameEn: "Six of Swords",
    nameCn: "宝剑六",
    keywords: ["过渡", "离开", "治愈", "前进"],
    image: "sw06.jpg",
    description:
      "A ferryman bears passengers toward the farther shore—passage, remedy, envoy and travel by water to calmer ground.  摆渡人载着乘客驶向彼岸，寓意过渡、疗愈与驶向平静的旅程或使命。",
  },
  {
    id: 56,
    nameEn: "Seven of Swords",
    nameCn: "宝剑七",
    keywords: ["欺骗", "策略", "隐秘", "逃避"],
    image: "sw07.jpg",
    description:
      "A man hastens off with five swords, two left behind near a camp—design, daring attempt, quarrel and the risk of cunning plans.  男子急奔带走五剑，营旁留二剑，象征谋划与冒险、争执以及机巧计划的风险。",
  },
  {
    id: 57,
    nameEn: "Eight of Swords",
    nameCn: "宝剑八",
    keywords: ["束缚", "受害者心态", "无助", "限制"],
    image: "sw08.jpg",
    description:
      "A bound and hoodwinked woman stands among swords—temporary durance, crisis and censure, yet not irretrievable bondage.  被绑蒙眼的女子被剑阵环绕，代表暂时的束缚、危机与责难，但仍可解脱。",
  },
  {
    id: 58,
    nameEn: "Nine of Swords",
    nameCn: "宝剑九",
    keywords: ["焦虑", "噩梦", "担忧", "恐惧"],
    image: "sw09.jpg",
    description:
      "One sits up in lamentation beneath nine swords—utter desolation, despair, deception and delay.  有人在床上痛苦而坐，九剑悬顶，象征极度的绝望、欺骗与停滞带来的煎熬。",
  },
  {
    id: 59,
    nameEn: "Ten of Swords",
    nameCn: "宝剑十",
    keywords: ["毁灭", "痛苦结局", "背叛", "最低点"],
    image: "sw10.jpg",
    description:
      "A prostrate figure pierced by ten swords—the end of a cycle, pain and desolation, though not always violent death.  倒地之人被十剑贯穿，象征阶段的终结、剧痛与荒凉，未必意味着暴亡。",
  },
  {
    id: 60,
    nameEn: "Page of Swords",
    nameCn: "宝剑侍从",
    keywords: ["好奇", "警惕", "新想法", "沟通"],
    image: "swpa.jpg",
    description:
      "An active youth strides with sword upright, alert to every side—vigilance, spying, examination and nimble mind.  敏捷的侍从举剑疾行、四处戒备，象征警觉、侦查与灵巧的思维。",
  },
  {
    id: 61,
    nameEn: "Knight of Swords",
    nameCn: "宝剑骑士",
    keywords: ["急躁", "直接", "行动", "野心"],
    image: "swkn.jpg",
    description:
      "A knight charges full course with sword out—skill, wrath and swift militant intelligence that can destroy or defend.  骑士策马挥剑疾进，代表技能与迅猛的战斗意志，可攻亦可守。",
  },
  {
    id: 62,
    nameEn: "Queen of Swords",
    nameCn: "宝剑王后",
    keywords: ["敏锐", "独立", "清晰", "界限"],
    image: "swqu.jpg",
    description:
      "Severe yet composed, the Queen raises her sword and extends her hand—widowhood, sorrow-tinged clarity and discerning fairness.  庄严的王后执剑并伸出手，带着历经忧伤的清醒与公平的辨识力。",
  },
  {
    id: 63,
    nameEn: "King of Swords",
    nameCn: "宝剑国王",
    keywords: ["理智", "权威", "真理", "公正"],
    image: "swki.jpg",
    description:
      "The King sits in judgment with unsheathed sword—authority, command and militant intellect holding power of life and death.  国王持裸剑端坐审判，象征权威、指挥与握有生杀大权的理性力量。",
  },

  // --- PENTACLES (Earth / Material) ---
  {
    id: 64,
    nameEn: "Ace of Pentacles",
    nameCn: "星币首牌",
    keywords: ["新机会", "繁荣", "丰富", "表现"],
    image: "peac.jpg",
    description:
      "A hand from the cloud lifts a pentacle—perfect contentment and prosperous beginnings, the seed of material felicity.  云间之手托起五芒星币，象征圆满与富足的开端，物质幸福的种子。",
  },
  {
    id: 65,
    nameEn: "Two of Pentacles",
    nameCn: "星币二",
    keywords: ["平衡", "适应", "优先顺位", "灵活"],
    image: "pe02.jpg",
    description:
      "A dancer juggles two pentacles joined by an endless cord—gaiety amid change, written news and the play of adaptation.  舞者以无限符号连结双币抛接，寓意变动中的轻快、书信讯息与灵活应变。",
  },
  {
    id: 66,
    nameEn: "Three of Pentacles",
    nameCn: "星币三",
    keywords: ["团队", "合作", "技能", "计划"],
    image: "pe03.jpg",
    description:
      "A sculptor works in a monastery with others consulting—skilled labor, recognized craft and nobility of practiced art.  雕工在修道院中作业并受人商议，象征熟练技艺、合作认可与实践艺术的尊贵。",
  },
  {
    id: 67,
    nameEn: "Four of Pentacles",
    nameCn: "星币四",
    keywords: ["控制", "占有", "保守", "安全"],
    image: "pe04.jpg",
    description:
      "Crowned figure clasps a pentacle, with one above and two beneath his feet—surety of possessions and clinging to what one has.  戴冠者手抱钱币，头顶与脚下亦各有一币，象征守财与牢牢抓住现有的一切。",
  },
  {
    id: 68,
    nameEn: "Five of Pentacles",
    nameCn: "星币五",
    keywords: ["贫穷", "孤立", "不安全", "困难"],
    image: "pe05.jpg",
    description:
      "Two mendicants pass a lighted window in snow—material trouble, destitution or discord pressing from without.  两名乞者在风雪中经过亮窗，寓意物质困境、贫乏或外在纷乱的压迫。",
  },
  {
    id: 69,
    nameEn: "Six of Pentacles",
    nameCn: "星币六",
    keywords: ["慈善", "慷慨", "分享", "平衡"],
    image: "pe06.jpg",
    description:
      "A merchant weighs and gives coins to the needy—presents, present prosperity and the balance of giving and receiving.  商人秤量钱币分给贫者，象征馈赠、当前的富足以及施与受的平衡。",
  },
  {
    id: 70,
    nameEn: "Seven of Pentacles",
    nameCn: "星币七",
    keywords: ["耐心", "投资", "等待", "长期规划"],
    image: "pe07.jpg",
    description:
      "A worker leans on his staff regarding seven pentacles on the vine—money and business weighed, with anxieties over return.  劳者倚杖凝视藤上七币，代表金钱与事业的衡量，也暗示收益未明的忧虑与等待。",
  },
  {
    id: 71,
    nameEn: "Eight of Pentacles",
    nameCn: "星币八",
    keywords: ["勤奋", "技能", "工艺", "细节"],
    image: "pe08.jpg",
    description:
      "An artisan chisels pentacles he displays—work, apprenticeship, craft skill perhaps still in preparation.  工匠雕琢并陈列钱币，象征勤作、学徒阶段与正在精进的技艺。",
  },
  {
    id: 72,
    nameEn: "Nine of Pentacles",
    nameCn: "星币九",
    keywords: ["富足", "奢华", "自给自足", "成就"],
    image: "pe09.jpg",
    description:
      "A lady with a hooded bird walks a rich vineyard estate—prudence, safety, accomplishment and independent well-being.  携驯鹰的女子漫步葡萄园庄园，象征谨慎、安全、成就与自足的安乐。",
  },
  {
    id: 73,
    nameEn: "Ten of Pentacles",
    nameCn: "星币十",
    keywords: ["财富", "遗产", "家庭", "长期成功"],
    image: "pe10.jpg",
    description:
      "Beneath an arch a family with dogs greets an elder—riches, legacy, archives and the abode of generations.  拱门下家人与犬迎向长者，寓意财富、传承与家族居所的稳固。",
  },
  {
    id: 74,
    nameEn: "Page of Pentacles",
    nameCn: "星币侍从",
    keywords: ["好学", "务实", "新机会", "显化"],
    image: "pepa.jpg",
    description:
      "A youth slowly advances, absorbed in the pentacle he lifts—study, application, management and sometimes news or messages.  侍从专注举起钱币缓步前行，象征学习投入、管理才能，也可能带来讯息。",
  },
  {
    id: 75,
    nameEn: "Knight of Pentacles",
    nameCn: "星币骑士",
    keywords: ["勤奋", "效率", "例行公事", "保守"],
    image: "pekn.jpg",
    description:
      "On a heavy, enduring horse the Knight presents his pentacle—utility, responsibility and steady service on the outer plane.  骑着沉稳坐骑的骑士举币示人，代表务实、责任与踏实的服务精神。",
  },
  {
    id: 76,
    nameEn: "Queen of Pentacles",
    nameCn: "星币王后",
    keywords: ["养育", "务实", "安全", "居家"],
    image: "pequ.jpg",
    description:
      "A serious, generous Queen contemplates her pentacle—opulence, security, greatness of soul and wise provision.  沉稳慷慨的王后凝视钱币，象征富足、安全、宽广胸怀与妥善的资源运用。",
  },
  {
    id: 77,
    nameEn: "King of Pentacles",
    nameCn: "星币国王",
    keywords: ["富裕", "商业", "领导", "安全感"],
    image: "peki.jpg",
    description:
      "The King with pentagrammed coin and bull emblems—realizing intelligence in business, courage and success in material mastery.  带有五芒星币与公牛徽记的国王，代表商业上的聪慧、勇气与物质领域的成功掌控。",
  },
];

// Helper to get image URL with fallback support
// Tries local image first, falls back to remote CDN if not available
export const getCardImageUrl = (image: string) => `${LOCAL_CDN}${image}`;
export const getCardImageFallbackUrl = (image: string) =>
  `${REMOTE_CDN}${image}`;

export const FULL_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

// Pre-defined scripts for the static voice parts
export const STATIC_SCRIPTS = {
  WELCOME: "静心凝视深渊。当你的直觉苏醒时,进入命运之门。",
  ASK: "心中的疑惑,是通往真理的钥匙。告诉我,你为何而来？",
  SHUFFLE: "星辰正在归位,混乱中孕育着秩序。专注于你的问题。",
  PICK: "在流动的命运中,选择你的指引。",
  REVEAL: "这就是……命运的回响。",
};

// Helper to get deck for a specific pool type
export const getDeckForPool = (pool: CardPoolType): TarotCard[] => {
  const courtPrefixes = ["Page", "Knight", "Queen", "King"];
  const isCourt = (c: TarotCard) =>
    courtPrefixes.some((p) => c.nameEn.startsWith(p));

  switch (pool) {
    case "MAJOR":
      return MAJOR_ARCANA;
    case "MINOR_PIP":
      return MINOR_ARCANA.filter((c) => !isCourt(c));
    case "COURT":
      return MINOR_ARCANA.filter((c) => isCourt(c));
    case "SUIT_CUPS":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Cups"));
    case "SUIT_PENTACLES":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Pentacles"));
    case "SUIT_SWORDS":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Swords"));
    case "SUIT_WANDS":
      return MINOR_ARCANA.filter((c) => c.nameEn.includes("Wands"));
    case "FULL":
    default:
      return FULL_DECK;
  }
};
