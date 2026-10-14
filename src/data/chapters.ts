export type Language = "ur" | "roman" | "en";

export interface Chapter {
  id: string;
  number: number;
  numeral: string;
  urdu: string;
  name: string;
  subtitle: string;
  poems: Record<Language, string>;
}

// The supplied manuscript is reproduced verbatim, including its translations.
// Blank lines delimit stanzas; individual newlines remain intentional verse breaks.
export const chapters: Chapter[] = [
  {
    id: "hubb", number: 1, numeral: "I", urdu: "حب", name: "Hubb", subtitle: "The Awakening of Love",
    poems: {
      ur: `تیرے دیدارِ اوّل سے دل میں اک داستاں نے جنم لیا، اک ہی لمحے میں میرے دل کا رُخ تیری جانب مڑ گیا۔

رفتہ رفتہ اک انجانی کشش مجھے تیری راہوں کی جانب کھینچتی رہی۔

یہ تو فقط ابتدا تھی، اک ایسی داستان کی ابتدا، جس کا انجام ابھی پردۂ غیب میں تھا، مگر اسی بے خبری میں اک عجیب حسن پوشیدہ تھا۔`,
      roman: `Tere deedaar-e-awwal se dil mein ek daastaan ne janam liya, Ek hi lamhe mein mere dil ka rukh teri jaanib mud gaya.

Rafta rafta ek anjaani kashish mujhe teri raahon ki jaanib kheenchti rahi.

Yeh toh faqat ibtida thi, ek aisi daastaan ki ibtida, Jis ka anjaam abhi parda-e-ghaib mein tha, Magar isi be-khabari mein ek ajeeb husn posheeda tha.`,
      en: `When I first saw you, your presence initiated a tale, a sudden shift in my heart towards you.

Slowly, something kept pulling me towards your pathways.

This was just the beginning, the beginning of a story that remains beautifully unknown.`,
    },
  },
  {
    id: "uns", number: 2, numeral: "II", urdu: "انس", name: "Uns", subtitle: "The Tranquility of Closeness",
    poems: {
      ur: `دل تیرے نشۂ ہستی میں سرشار، سرشار رہنے لگا، تیرے کلام میں تسکین، تیری قربت میں قرار ملنے لگا۔

ہر روز یوں محسوس ہوتا ہے کہ یہ سب نوشتۂ تقدیر تھا، کہ یہ لمحۂ وصال ازل ہی سے ہمارے نام لکھا گیا تھا، اور کائنات صدیوں سے اسی ساعت کی منتظر تھی۔

رفتہ رفتہ ہمارا بے لفظ رشتۂ دل گہرا ہوتا گیا، اور اسی لمحے مجھ پر رازِ ہستی آشکار ہوا، کہ وجود رکھنے کا مفہوم کیا ہے۔`,
      roman: `Dil tere nasha-e-hasti mein sarshaar, sarshaar rehne laga, Tere kalaam mein taskeen, teri qurbat mein qaraar milne laga.

Har roz yun mehsoos hota hai ke yeh sab navishta-e-taqdeer tha, Ke yeh lamha-e-visaal azal hi se hamaare naam likha gaya tha, Aur kainaat sadiyon se isi saa’at ki muntazir thi.

Rafta rafta hamaara be-lafz rishta-e-dil gehra hota gaya, Aur usi lamhe mujh par raaz-e-hasti aashkaar hua, Ke wajood rakhne ka mafhoom kya hai.`,
      en: `My heart is drunk, drunk on your essence.

My heart can only find tranquility in your speech, in your solace.

Every day, I feel like this was destiny.

That this moment we share was meant to be, and the universe waited, centuries, for this.

Slowly, our unspoken connection began to deepen, and in the moment, I understood what it meant to exist.`,
    },
  },
  {
    id: "ishq", number: 3, numeral: "III", urdu: "عشق", name: "Ishq", subtitle: "The Longing of the Soul",
    poems: {
      ur: `جو کبھی فقط چاہت تھی، اب احتیاجِ جاں بن گئی، تیری آرزو ہی وہ واحد دھڑکن بنی جسے میرا دل دھڑکنا چاہتا تھا۔

میری روح کا ذرّہ ذرّہ اب تیرے خیال کی خوشبو سے معطّر ہے، میری ہر فکر کے تار و پود میں تو ہی تو پیوست ہے۔

کیا اپنی حیات کی باقی داستان میں تجھے بھی بُن لینے کی اجازت ہے؟`,
      roman: `Jo kabhi faqat chahat thi, ab ihtiyaaj-e-jaan ban gayi, Teri aarzoo hi woh waahid dhadkan bani jise mera dil dhadakna chahta tha.

Meri rooh ka zarra zarra ab tere khayaal ki khushboo se mu’attar hai, Meri har fikr ke taar-o-pood mein tu hi tu paiwast hai.

Kya apni hayaat ki baaqi daastaan mein Tujhe bhi bun lene ki ijaazat hai?`,
      en: `Once desire, now need; your longing was the only beat my heart wanted to beat. Every inch of my very soul, now fragrant with your thoughts.

But with every thought I have of you, are woven entirely. Can I wove you into the remaining story of my life?`,
    },
  },
  {
    id: "aqeedat", number: 4, numeral: "IV", urdu: "عقیدت", name: "Aqeedat", subtitle: "The Surrender of Faith",
    poems: {
      ur: `دل کو اب کسی قرار سے قرار نہیں آتا، تجھ پر جو اعتبار رکھا، وہ ہر دم فزوں تر ہوتا جاتا ہے۔

میری ہر نیّت، ہر ارادہ، اب تیرے حضور سراپا ادب سے سرنگوں ہے۔`,
      roman: `Dil ko ab kisi qaraar se qaraar nahin aata, Tujh par jo aitbaar rakha, woh har dam fazoon-tar hota jaata hai.

Meri har niyyat, har iraada, Ab tere huzoor saraapa adab se sar-nigoon hai.`,
      en: `My heart cant stay content. I’ve put my faith in you, and it’s ever growing.

Every intention of my now bows gracefully to you.`,
    },
  },
  {
    id: "ibadat", number: 5, numeral: "V", urdu: "عبادت", name: "Ibadat", subtitle: "The Sacred Devotion",
    poems: {
      ur: `تیرا نام ہی اب میرے لبوں کی واحد دعا ہے، تیرا ذکر ہی وہ واحد نغمہ جسے میری روح گنگنانا چاہتی ہے، اور تیری ہی صدا میرے وجود کی ہر لرزش میں گونجتی ہے۔

اب میری ہر مناجات فقط تجھی کو پکارتی ہے، اور میری ہر دعا میں فقط ایک ہی آرزو ہے، کہ تیرے حضور کے سُرور میں ہمیشہ سرشار رہوں۔

تو ہی میری جائے پناہ، تو ہی میری دعاؤں کی اجابت، مگر کیا میری دعائیں عمر بھر یوں ہی قبول ہوتی رہیں گی؟`,
      roman: `Tera naam hi ab mere labon ki waahid dua hai, Tera zikr hi woh waahid naghma jise meri rooh gungunaana chahti hai, Aur teri hi sada mere wajood ki har larzish mein goonjti hai.

Ab meri har munaajaat faqat tujhi ko pukaarti hai, Aur meri har dua mein faqat ek hi aarzoo hai, Ke tere huzoor ke suroor mein hamesha sarshaar rahoon.

Tu hi meri jaaye-panaah, tu hi meri duaaon ki ijaabat, Magar kya meri duaaein umr bhar yun hi qubool hoti rahengi?`,
      en: `Your name is the only prayer I want to pray, only poem I want to sing, and the only noise my vibration makes.

Now my prayers only call you, and the only blessing I want is to get drunk in your presence. You are my sanctuary and fulfillment to my prayers. Will my prayers be answer for the rest of my life`,
    },
  },
  {
    id: "junoon", number: 6, numeral: "VI", urdu: "جنون", name: "Junoon", subtitle: "The Madness of Love",
    poems: {
      ur: `تجھ میں یوں گم ہوا کہ ہوش و خرد سب کھو بیٹھا، تیرے عشق کے نشے میں ایسا سرمست ہوا، کہ اہلِ جہاں کی نگاہ میں دیوانہ ٹھہرا۔

کاش وہ جانتے، کاش وہ جانتے، کہ آتشِ عشق میں جلنے کا احساس کیا ہے، تیرے عشق کی شعلہ فشاں آگ میں یوں جلتے رہنے کا عالم کیا ہے۔`,
      roman: `Tujh mein yun gum hua ke hosh-o-khirad sab kho baitha, Tere ishq ke nashe mein aisa sar-mast hua, Ke ahl-e-jahaan ki nigaah mein deewaana thehra.

Kaash woh jaante, kaash woh jaante, Ke aatish-e-ishq mein jalne ka ehsaas kya hai, Tere ishq ki shola-fishaan aag mein Yun jalte rehne ka aalam kya hai.`,
      en: `I lost myself in you, losing all sensibility. I’m drunk in your love; to the world, I’ve lost and gone mad. If only they knew, if only they knew how it feels, how it feels to simply burn in the roaring fire of your love.`,
    },
  },
  {
    id: "fanaa", number: 7, numeral: "VII", urdu: "فنا", name: "Fanaa", subtitle: "The Annihilation of Self",
    poems: {
      ur: `اک سوال تھا جو مدتوں سے میرے باطن میں گونجتا رہا، کہ میرا "میں" کہاں ہے؟ اب جبکہ ہر سُو فقط تو ہی تو ہے۔

فنائے ذات کی انتہا ہی میں رازِ بقائے جاوداں پوشیدہ ہے، کہ تیرے وجود میں اپنی ہستی کو مٹا کر، مجھ پر اپنی ہی ہستی کا مفہوم آشکار ہوا۔`,
      roman: `Ek sawaal tha jo muddaton se mere baatin mein goonjta raha, Ke mera "main" kahaan hai? Ab jabke har soo faqat tu hi tu hai.

Fanaa-e-zaat ki intiha hi mein raaz-e-baqaa-e-jaavidaan posheeda hai, Ke tere wajood mein apni hasti ko mita kar, Mujh par apni hi hasti ka mafhoom aashkaar hua.`,
      en: `Now that ive lost
I had a question: Where do "I" exist? Now that there is only you, the total self annihilation is where true immortality is found, for by losing myself in you, have found what it means to be me.`,
    },
  },
];

export const bookTitle = { urdu: "عشق کے سات مقامات", roman: "Ishq Ke Saat Maqamaat", english: "The Seven Stages of Love" };
export const closingLine = "And in losing myself in you, I discovered what it meant to exist.";

// Supply a recorded paper sound here to enable the optional, initially muted toggle.
export const pageTurnAudio: string | null = null;
