// ── קבועים ──
const LEVEL_UP_AT    = 3;
const POINTS_CORRECT = 10;
const STORAGE_KEY    = "sparky_players";
const LEVEL_ORDER    = ["easy", "medium", "hard", "genius", "king"];

const ACHIEVEMENTS = [
    { key: "beginner",  label: "🥉 מתחיל חידות",  threshold: 10  },
    { key: "champion",  label: "🥈 אלוף חידות",    threshold: 25  },
    { key: "genius",    label: "🥇 גאון חידות",    threshold: 50  },
    { key: "king",      label: "👑 מלך החידות",    threshold: 100 }
];

// ── מצב הסשן (בזיכרון בלבד) ──
let currentUserName     = "";
let currentDifficulty   = "easy";
let correctInLevel      = 0;
let riddleAnswered      = false;
let usedIndices         = [];
let currentRiddle       = null;
let currentScore        = 0;
let sessionCorrect      = 0;
let sessionWrong        = 0;
let sessionHighestLevel = "easy";

// ── בדיחות וסרטים ──
const jokes = [
    "למה הדג לא הולך לבית ספר? כי הוא כבר שוחה בחומר!",
    "מה אומר קיר לקיר? ניפגש בפינה!",
    "למה המחשב הלך לרופא? כי היה לו וירוס!",
    "למה העיפרון עצוב? כי הוא מחודד מדי!",
    "למה התרנגולת חצתה את הכביש? כדי להגיע לצד השני!"
];
const movies = [
    "מואנה", "צעצוע של סיפור", "לשבור את הקרח",
    "מפלצות בע״מ", "מוצאים את נמו", "קונג פו פנדה"
];

// ── מאגר חידות ──
const riddlesByDifficulty = {
    easy: [
        { question: "יש לי ארבע רגליים אבל אני לא הולך. מי אני?", answer: "שולחן" },
        { question: "מה עולה למעלה אבל לא יורד?", answer: "הגיל" },
        { question: "מה נשבר בלי שנוגעים בו?", answer: "הבטחה" },
        { question: "מה רטוב ככל שהוא מייבש יותר?", answer: "מגבת" },
        { question: "יש לי שיניים אבל אני לא נושך. מה אני?", answer: "מסרק" },
        { question: "יש לי גב אבל אני לא אדם. מה אני?", answer: "ספר" },
        { question: "מה יש בבוקר ארבע רגליים, בצהריים שתיים, ובערב שלוש?", answer: "אדם" },
        { question: "יש לי כנפיים אבל אני לא עוף. מה אני?", answer: "מטוס" },
        { question: "מה גדל ככל שלוקחים ממנו יותר?", answer: "חור" },
        { question: "אני מדבר כשמדברים אלי. מה אני?", answer: "הד" },
        { question: "מה שחור כשקונים, אדום כשמשתמשים, ואפור כשזורקים?", answer: "פחם" },
        { question: "מה ניתן לשמור ולא ניתן לסגור?", answer: "סוד" },
        { question: "אין לו עצמות אבל יש לו אצבעות. מה זה?", answer: "כפפה" },
        { question: "קטן כעכבר אבל שומר על הבית כמו אריה. מה אני?", answer: "מנעול" },
        { question: "יש לי ראש ויש לי זנב, אבל אין לי גוף. מה אני?", answer: "מטבע" },
        { question: "כשאני נקי אני שחור, כשאני מלוכלך אני לבן. מה אני?", answer: "לוח" },
        { question: "מה גבוה יותר מהבית אבל קל יותר מנוצה?", answer: "עשן" },
        { question: "יש לי ידיים אבל אין לי אצבעות, יש לי פנים אבל אין לי עיניים. מה אני?", answer: "שעון" },
        { question: "מה תמיד נמצא לפניך אבל לא ניתן לראות?", answer: "עתיד" },
        { question: "מה ניתן לשבור ולא ניתן לתקן?", answer: "לב" },
        { question: "אני מראה לך את עצמך אבל אני לא אתה. מה אני?", answer: "מראה" },
        { question: "מה גדול כשצעיר וקטן כשזקן?", answer: "נר" },
        { question: "מה עובר אבל לא זז?", answer: "זמן" },
        { question: "יורד מהגג ואין לו רגליים. מה זה?", answer: "גשם" },
        { question: "איזו מחלה הכי קל לתפוס?", answer: "צחוק" },
        { question: "אני לא נוסע אבל מגיע לכל מקום. מה אני?", answer: "דואר" },
        { question: "מה יש לך אבל אחרים משתמשים בו יותר ממך?", answer: "שמך" },
        { question: "מה גדל ככל שאוכלים יותר?", answer: "תיאבון" },
        { question: "מה יש בים שאין בנהר?", answer: "מלח" },
        { question: "יש לי דפים אבל אני לא ספר. יש לי ימים אבל אני לא שנה. מה אני?", answer: "לוח שנה" }
    ],
    medium: [
        { question: "אני חי כשמאכילים אותי ומת כשמשקים אותי. מה אני?", answer: "אש" },
        { question: "מה ניתן לתת לאחרים ולשמור גם לעצמך?", answer: "ידע" },
        { question: "כמה חודשים בשנה יש בהם 28 ימים?", answer: "שנים עשר" },
        { question: "אדם עקף את הרץ שנמצא במקום השני. באיזה מקום הוא עכשיו?", answer: "שני" },
        { question: "מה ניתן לתפוס אבל לא לזרוק?", answer: "הצטננות" },
        { question: "מה מגיעה לבית פעם אחת ויוצאת אלפי פעמים?", answer: "דלת" },
        { question: "מה גדל ולא נולד, ונפל ולא מת?", answer: "שלג" },
        { question: "מה יותר שימושי כשהוא שבור?", answer: "ביצה" },
        { question: "חמישה אחים, לכולם שם שונה אבל גם שם משותף. מי הם?", answer: "אצבעות" },
        { question: "מה ניתן לראות בחדר חשוך לגמרי?", answer: "חושך" },
        { question: "מה יש לשנה שאין לחודש?", answer: "עונות" },
        { question: "מה תמיד מגיע אבל לא מגיע לעולם?", answer: "מחר" },
        { question: "אם יש לך שלושה תפוחים ולקחת שניים, כמה תפוחים יש לך?", answer: "שניים" },
        { question: "מה יש לנהר שאין לאגם?", answer: "זרם" },
        { question: "מה ניתן לשמוע אבל לא לראות ולא לגעת?", answer: "קול" },
        { question: "מה הולך ולא עייף, מראה תמיד את האמת?", answer: "שעון" },
        { question: "יש לי קורות אבל אני לא בית, יש לי ענפים אבל אני לא עץ. מה אני?", answer: "בנק" },
        { question: "ילד נולד ביום שישי. שלושה ימים לאחר מכן יצא ביום שישי. איך?", answer: "שמו שישי" },
        { question: "מה ניתן לראות רק ממרחק?", answer: "אופק" },
        { question: "אם ביצה וחצי שוות שקל וחצי, כמה שוות שלוש ביצים?", answer: "שלושה שקלים" },
        { question: "מה ניתן לחבר בלי דבק?", answer: "ידיים" },
        { question: "מהי שנת המוות של מי שנולד ב-50 לפנה״ס ומת בגיל 25?", answer: "25 לפנה״ס" },
        { question: "כמה מחיצות צריך בין 4 ספרים בשורה?", answer: "שלוש" },
        { question: "מה יש לכלב שאין לחתול?", answer: "נביחה" },
        { question: "מה ניתן לאבד אבל לא לקנות בכסף?", answer: "שם טוב" }
    ],
    hard: [
        { question: "יש לי ערים אבל לא בתים, יש לי יערות אבל לא עצים, יש לי מים אבל לא דגים. מה אני?", answer: "מפה" },
        { question: "מה מופיע פעמיים ביוני, פעם אחת בינואר, ואף פעם לא בשנה?", answer: "האות י" },
        { question: "אמא של מרים היא בת חמש בנות. שמות ארבע מהן: אביגיל, בת-חן, גלית, דנה. מה שם הבת החמישית?", answer: "מרים" },
        { question: "ישנם שני אבות ושני בנים, ועל שולחנם שלושה תפוחים. כל אחד קיבל תפוח שלם. איך?", answer: "סב, אב ונכד" },
        { question: "מה ניתן להוסיף לדבר כלשהו ולגרום לו להיות קל יותר?", answer: "חורים" },
        { question: "שניים שתמיד זזים יחד אבל לעולם לא רואים אחד את השני. מה הם?", answer: "רגליים" },
        { question: "מה הולך מעלה ולא זז מהמקום?", answer: "מדרגות" },
        { question: "כמה חיות ניתן לשים בקופסה ריקה?", answer: "אחת" },
        { question: "אין לי אחים ואחיות. אבא של האיש בתמונה הוא בנו של אבי. מי האיש?", answer: "בני" },
        { question: "מה מופיע פעם אחת בשנה, פעם אחת בחודש, ואף פעם ביום?", answer: "האות ש" },
        { question: "חמישה אנשים עמדו מתחת לאותה מטרייה ואף אחד לא נרטב. איך יתכן?", answer: "לא ירד גשם" },
        { question: "אדם גר בקומה ה-10. כל יום עולה ברגל עד קומה 7 ואז במעלית. בגשם הוא לוקח מעלית ישר ל-10. למה?", answer: "כי הוא גמד" },
        { question: "ישנן שלוש אחיות. לכל אחת יש אח אחד. כמה אחים יש לאחיות בסך הכל?", answer: "אחד" },
        { question: "מה ניתן לאחוז ביד שמאל אבל לא ביד ימין?", answer: "יד ימין" },
        { question: "אדם בנה בית שכל ארבעת קירותיו פונים לדרום. דוב עבר ליד הבית. מה צבע הדוב?", answer: "לבן" },
        { question: "שלושה אנשים קפצו לים אבל ראשיהם לא נרטבו. איך?", answer: "כי הם קרחים" },
        { question: "מה יש פעמיים בתפוח ופעם אחת בתפוז?", answer: "האות פ" },
        { question: "30 פרות חולבות 90 ליטר ב-3 דקות. כמה זמן לחלוב 30 ליטר עם 10 פרות?", answer: "3 דקות" },
        { question: "כמה ביצים ניתן לאכול על בטן ריקה?", answer: "אחת" },
        { question: "אם אתה עומד בדיוק בקוטב הצפוני, לאיזה כיוון תפנה לאן שלא תסתכל?", answer: "דרום" }
    ],
    genius: [
        // ── מספריות ──
        { question: "מה המספר הבא: 2, 4, 8, 16, ___?", answer: "32", numeric: true },
        { question: "איזה מספר חסר בסדרת פיבונאצ׳י: 1, 1, 2, 3, 5, 8, ___?", answer: "13", numeric: true },
        { question: "מה המספר הבא (ריבועים): 1, 4, 9, 16, 25, ___?", answer: "36", numeric: true },
        { question: "מה המספר הבא: 2, 6, 12, 20, 30, ___?", answer: "42", numeric: true },
        { question: "מה התוצאה: 12 × 12?", answer: "144", numeric: true },
        { question: "מה 25% מ-200?", answer: "50", numeric: true },
        { question: "מה שורש ריבועי של 144?", answer: "12", numeric: true },
        { question: "כמה שניות יש בשעה?", answer: "3600", numeric: true },
        { question: "כמה אפסים יש במיליון?", answer: "6", numeric: true },
        { question: "אם 5 ציפורים יושבות על גדר ו-2 עפו, כמה נשארו?", answer: "3", numeric: true },
        { question: "כמה רגליים יש לעכביש?", answer: "8", numeric: true },
        { question: "כמה פאות יש לקובייה?", answer: "6", numeric: true },
        { question: "כמה משבצות יש בלוח שחמט?", answer: "64", numeric: true },
        { question: "יש לך 17 כבשים. כולן מתו חוץ מ-9. כמה נשארו?", answer: "9", numeric: true },
        // ── בחירה מרובה עם distractors חכמים ──
        { question: "מה גדול יותר: 3×8 או 4×6?", answer: "שווים בדיוק",
          distractors: ["3×8 גדול יותר", "4×6 גדול יותר", "אי אפשר לדעת"] },
        { question: "מה קורה אם מכפילים כל מספר ב-0?", answer: "תמיד מקבלים אפס",
          distractors: ["תמיד מקבלים 1", "מקבלים את המספר עצמו", "תלוי במספר"] },
        { question: "מה ארוך יותר: קילומטר אחד או 1,000 מטר?", answer: "שווים בדיוק",
          distractors: ["קילומטר ארוך יותר", "1,000 מטר ארוכים יותר", "תלוי בנסיבות"] },
        { question: "מה כוכב הלכת הגדול ביותר במערכת השמש?", answer: "צדק",
          distractors: ["שבתאי", "נפטון", "אורנוס"] },
        { question: "מה הפלנטה הקרובה ביותר לשמש?", answer: "כוכב חמה",
          distractors: ["נוגה", "כדור הארץ", "מאדים"] },
        { question: "ממה עשוי זכוכית?", answer: "חול",
          distractors: ["אבן", "מתכת", "מים"] },
        { question: "כמה לבבות יש לתמנון?", answer: "שלושה",
          distractors: ["אחד", "שניים", "ארבעה"] },
        { question: "מה הגז העיקרי שאנחנו נושמים?", answer: "חמצן",
          distractors: ["חנקן", "פחמן דו חמצני", "הליום"] },
        { question: "מה קורה למים כשמחממים אותם ל-100 מעלות?", answer: "רותחים",
          distractors: ["קופאים", "מתגבשים", "נשארים נוזלים"] },
        { question: "מה שם הקו המדומה שמחלק את כדור הארץ לחצי?", answer: "קו המשווה",
          distractors: ["קו האורך", "קו הרוחב", "קו הגבול הבינלאומי"] },
        { question: "כמה צלעות יש למשושה?", answer: "שש",
          distractors: ["חמש", "שבע", "שמונה"] },
        { question: "כמה ממדים יש לנקודה?", answer: "אפס",
          distractors: ["אחד", "שניים", "שלושה"] },
        { question: "איזו צורה גיאומטרית היא החזקה ביותר מבחינה הנדסית?", answer: "משולש",
          distractors: ["ריבוע", "מעגל", "מלבן"] },
        { question: "מה האות הראשונה באלפבית היווני?", answer: "אלפא",
          distractors: ["ביתא", "גמא", "דלתא"] },
        { question: "כמה צבעים יש בקשת הצבעים?", answer: "שבעה",
          distractors: ["שישה", "שמונה", "חמישה"] },
        { question: "מה המשותף למספרים 2, 3, 5, 7, 11?", answer: "מספרים ראשוניים",
          distractors: ["מספרים זוגיים", "מספרים אי-זוגיים", "מספרים מושלמים"] }
    ],
    king: [
        // ── מספריות ──
        { question: "מה המספר הבא: 3, 7, 15, 31, 63, ___?", answer: "127", numeric: true },
        { question: "מה סכום כל המספרים השלמים מ-1 עד 100?", answer: "5050", numeric: true },
        { question: "מה 15% מ-80?", answer: "12", numeric: true },
        { question: "מה 7 בחזקת 2?", answer: "49", numeric: true },
        { question: "כמה דקות יש בשלוש שעות?", answer: "180", numeric: true },
        { question: "מה סכום 25 + 37 + 48?", answer: "110", numeric: true },
        { question: "מה 9 × 9 × 9?", answer: "729", numeric: true },
        { question: "מה המספר הבא: 5, 10, 20, 40, 80, ___?", answer: "160", numeric: true },
        { question: "כמה ימים יש בשלוש שנים רגילות?", answer: "1095", numeric: true },
        { question: "מה השורש הריבועי של 225?", answer: "15", numeric: true },
        { question: "מה 1000 חלקי 25?", answer: "40", numeric: true },
        { question: "מה המספר הבא: 2, 3, 5, 8, 13, 21, ___?", answer: "34", numeric: true },
        { question: "כמה שעות יש בשבוע?", answer: "168", numeric: true },
        { question: "מה 17 × 17?", answer: "289", numeric: true },
        { question: "מה 10% מ-450?", answer: "45", numeric: true },
        { question: "מה המספר הבא: 0, 1, 3, 6, 10, 15, ___?", answer: "21", numeric: true },
        { question: "כמה סנטימטרים יש במטר וחצי?", answer: "150", numeric: true },
        { question: "מה 5 בחזקת 3?", answer: "125", numeric: true },
        { question: "4 פרות חולבות 4 ליטר ב-4 דקות. כמה ליטר יחלבו 8 פרות ב-8 דקות?", answer: "16", numeric: true },
        { question: "גדר בנויה עם 10 עמודים. המרחק בין כל שניים — 2 מטר. מה אורך הגדר?", answer: "18", numeric: true },
        { question: "כמה חודשים בשנה יש בהם בדיוק 31 ימים?", answer: "7", numeric: true },
        { question: "באיזו שנה נחת האדם הראשון על הירח?", answer: "1969", numeric: true },
        { question: "8 אחים. לכל אחד אחות אחת. כמה ילדים יש בסך הכל?", answer: "9", numeric: true },
        { question: "5 מכונות מייצרות 5 חלקים ב-5 דקות. כמה מכונות מייצרות 100 חלקים ב-100 דקות?", answer: "5", numeric: true },
        { question: "נר נדלק ב-7 בערב ומכבים ב-3 לפנות בוקר. כמה שעות דלק?", answer: "8", numeric: true },
        // ── בחירה מרובה עם distractors חכמים ──
        { question: "אם כל הכלבים הם בעלי חיים, וסנופי הוא כלב, מה ניתן להסיק?",
          answer: "סנופי הוא בעל חיים",
          distractors: ["סנופי הוא אדם", "לא ניתן להסיק", "סנופי אינו כלב"] },
        { question: "עוד ארבעה ימים יהיה יום שישי. מה היום?",
          answer: "יום שני",
          distractors: ["יום ראשון", "יום שלישי", "יום רביעי"] },
        { question: "מה עונת השנה שבאה אחרי סתיו?",
          answer: "חורף",
          distractors: ["אביב", "קיץ", "חצי קיץ"] },
        { question: "מי מהבאים אינו שייך לקבוצה: תפוח, ענב, גזר, תפוז?",
          answer: "גזר",
          distractors: ["תפוח", "ענב", "תפוז"] },
        { question: "אדם רץ מזרחה, דרומה, מערבה וצפונה — אותו מרחק בכל כיוון. איפה הוא?",
          answer: "באותו מקום",
          distractors: ["מצפון למוצא", "ממזרח למוצא", "ממערב למוצא"] },
        { question: "מה הכוח שמושך חפצים אל כדור הארץ?",
          answer: "כבידה",
          distractors: ["מגנטיות", "חשמל", "חיכוך"] },
        { question: "כמה כוכבי לכת יש במערכת השמש?",
          answer: "שמונה",
          distractors: ["תשעה", "שבעה", "עשרה"] },
        { question: "מה הכוכב הקרוב ביותר לכדור הארץ?",
          answer: "השמש",
          distractors: ["אלפא קנטאורי", "הירח", "נוגה"] },
        { question: "מה הגז שמשמש לנפיחת בלונים שעפים?",
          answer: "הליום",
          distractors: ["מימן", "חנקן", "חמצן"] },
        { question: "איזה כוכב לכת מוקף בטבעות בולטות?",
          answer: "שבתאי",
          distractors: ["צדק", "אורנוס", "נפטון"] },
        { question: "מה בעל החיים המהיר ביותר ביבשה?",
          answer: "נמר הצייד",
          distractors: ["אריה", "נמר רגיל", "כלב הציד"] },
        { question: "מה בעל החיים היבשתי הגדול ביותר?",
          answer: "פיל אפריקאי",
          distractors: ["פיל אסייתי", "היפופוטם", "קרנף"] },
        { question: "מה הארץ הגדולה ביותר בעולם?",
          answer: "רוסיה",
          distractors: ["קנדה", "סין", "ארצות הברית"] },
        { question: "מה ההר הגבוה ביותר בעולם?",
          answer: "האוורסט",
          distractors: ["K2", "מון בלאן", "קילימנג'רו"] },
        { question: "מה הנהר הארוך ביותר בעולם?",
          answer: "הנילוס",
          distractors: ["האמזונס", "הוולגה", "המיסיסיפי"] },
        { question: "מי המציא את הנורה החשמלית?",
          answer: "תומס אדיסון",
          distractors: ["ניקולה טסלה", "בנג'מין פרנקלין", "אלפרד נובל"] },
        { question: "מי המציא את מכונת הדפוס?",
          answer: "גוטנברג",
          distractors: ["לאונרדו דה וינצ'י", "ניוטון", "גלילאו"] },
        { question: "מה יותר כבד: קילו ברזל או קילו נוצות?",
          answer: "שווים בדיוק",
          distractors: ["קילו ברזל כבד יותר", "קילו נוצות כבד יותר", "תלוי בגודל"] },
        { question: "מה ניתן לשבור רק עם הקול?",
          answer: "זכוכית",
          distractors: ["אבן", "עץ", "ברזל"] },
        { question: "מה שם התהליך שבו צמחים מייצרים מזון מאור שמש?",
          answer: "פוטוסינתזה",
          distractors: ["הנבטה", "נשימה", "ספיגה"] },
        { question: "מי כתב את מחזה רומיאו ויוליה?",
          answer: "שייקספיר",
          distractors: ["מולייר", "גתה", "צ'כוב"] },
        { question: "איזה בעל חיים יכול לשרוד בחלל החיצוני?",
          answer: "דוב מים",
          distractors: ["עקרב", "עכבר", "תוכי"] },
        { question: "מה הגז שצמחים מייצרים בפוטוסינתזה?",
          answer: "חמצן",
          distractors: ["פחמן דו חמצני", "חנקן", "מימן"] },
        { question: "מה ערך פי (π) לשתי ספרות אחרי הנקודה?",
          answer: "3.14",
          distractors: ["3.12", "3.17", "3.41"] },
        { question: "מה יש לפרפר שלא היה לו כזחל?",
          answer: "כנפיים",
          distractors: ["ראש", "גוף", "רגליים"] }
    ]
};

// ── תצורת רמות ──
const difficultyConfig = {
    easy:   { label: "🟢 מתחיל",      next: "medium" },
    medium: { label: "🟡 מתקדם",      next: "hard"   },
    hard:   { label: "🔴 אלוף",        next: "genius" },
    genius: { label: "🟣 גאון",        next: "king"   },
    king:   { label: "👑 מלך החידות", next: null     }
};

const ALL_SCREENS = [
    "name-screen", "main-screen", "difficulty-screen", "riddle-screen",
    "levelup-screen", "summary-screen", "leaderboard-screen",
    "joke-screen", "movie-screen", "ask-screen"
];

// ── ניהול מסכים ──
function showScreen(id) {
    ALL_SCREENS.forEach(s => document.getElementById(s).classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    if (id === "main-screen" && currentUserName) updatePlayerRecord();
}

function goBack() { showScreen("main-screen"); }

// ── עזרים ──
function escapeHTML(str) {
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function getLevelLabel(key) {
    return difficultyConfig[key] ? difficultyConfig[key].label : key;
}

function getAchievement(score) {
    for (let i = ACHIEVEMENTS.length - 1; i >= 0; i--) {
        if (score >= ACHIEVEMENTS[i].threshold) return ACHIEVEMENTS[i];
    }
    return null;
}

// ── localStorage ──
function loadPlayers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
}
function savePlayers(players) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}
function getPlayer(name) {
    const nl = name.toLowerCase().trim();
    return loadPlayers().find(p => p.name.toLowerCase() === nl) || null;
}

// מצבר ניקוד — מוסיף לסך הקיים, לא מחליף. מחזיר הישגים שנפתחו עכשיו.
function upsertPlayer(name, sessionScore, correct, wrong, level) {
    const players = loadPlayers();
    const today   = new Date().toISOString().split("T")[0];
    const nl      = name.toLowerCase().trim();
    const idx     = players.findIndex(p => p.name.toLowerCase() === nl);
    let newlyUnlocked = [];

    if (idx === -1) {
        newlyUnlocked = ACHIEVEMENTS.filter(a => sessionScore >= a.threshold);
        players.push({ name, score: sessionScore, correctTotal: correct,
                       wrongTotal: wrong, highestLevel: level, date: today,
                       earnedAchievements: newlyUnlocked.map(a => a.key) });
    } else {
        if (!players[idx].earnedAchievements) players[idx].earnedAchievements = [];
        players[idx].score        += sessionScore;
        players[idx].correctTotal  = (players[idx].correctTotal || 0) + correct;
        players[idx].wrongTotal    = (players[idx].wrongTotal   || 0) + wrong;
        players[idx].date          = today;
        if (LEVEL_ORDER.indexOf(level) > LEVEL_ORDER.indexOf(players[idx].highestLevel)) {
            players[idx].highestLevel = level;
        }
        newlyUnlocked = ACHIEVEMENTS.filter(a =>
            players[idx].score >= a.threshold &&
            !players[idx].earnedAchievements.includes(a.key)
        );
        newlyUnlocked.forEach(a => players[idx].earnedAchievements.push(a.key));
    }
    savePlayers(players);
    return newlyUnlocked;
}

// ── רשומת שחקן במסך הבית ──
function updatePlayerRecord() {
    const existing = getPlayer(currentUserName);
    const el       = document.getElementById("player-record");
    if (!existing) {
        el.innerHTML = "<p>ברוך הבא לספארקי! 🎉</p>";
    } else {
        const achievement = getAchievement(existing.score);
        el.innerHTML =
            "<p>👤 <strong>" + escapeHTML(existing.name) + "</strong></p>" +
            "<p>⭐ סך הניקוד: <strong>" + existing.score + "</strong></p>" +
            (achievement ? "<p>🏅 הישג: <strong>" + achievement.label + "</strong></p>" : "") +
            "<p>🏆 הרמה הגבוהה: <strong>" + getLevelLabel(existing.highestLevel) + "</strong></p>";
    }
    el.classList.remove("hidden");
}

// ── מסך שם ──
function saveName() {
    const raw     = document.getElementById("name-input").value.trim();
    const errorEl = document.getElementById("name-error");
    if (!raw) {
        errorEl.innerText = "צריך לכתוב שם כדי להתחיל 😊";
        return;
    }
    errorEl.innerText = "";
    // שחקן חוזר — שומרים את האיות המקורי שלו
    const existing = getPlayer(raw);
    currentUserName = existing ? existing.name : raw;
    document.getElementById("greeting").innerText = "שלום " + currentUserName + "! 👋";
    showScreen("main-screen");
}

// ── בחירת רמה ──
function goToDifficulty() { showScreen("difficulty-screen"); }

function startRiddles(difficulty, keepStats) {
    currentDifficulty = difficulty;
    if (!keepStats) {
        currentScore        = 0;
        sessionCorrect      = 0;
        sessionWrong        = 0;
        sessionHighestLevel = difficulty;
    } else {
        if (LEVEL_ORDER.indexOf(difficulty) > LEVEL_ORDER.indexOf(sessionHighestLevel)) {
            sessionHighestLevel = difficulty;
        }
    }
    correctInLevel = 0;
    usedIndices    = [];
    riddleAnswered = false;
    currentRiddle  = null;
    document.getElementById("score-value").innerText = currentScore;
    showScreen("riddle-screen");
    updateProgress();
    showRiddle();
}

function updateProgress() {
    const cfg = difficultyConfig[currentDifficulty];
    document.getElementById("level-indicator").innerText = "רמה: " + cfg.label;
    document.getElementById("progress-bar").style.width =
        Math.min((correctInLevel / LEVEL_UP_AT) * 100, 100) + "%";
    document.getElementById("progress-label").innerText =
        "✅ " + correctInLevel + " / " + LEVEL_UP_AT + " לעלייה ברמה";
}

// ── חידה ──
function showRiddle() {
    riddleAnswered = false;
    document.getElementById("riddle-result").innerText = "";
    document.getElementById("riddle-result").className  = "";
    document.getElementById("next-riddle-btn").classList.add("hidden");

    const riddles = riddlesByDifficulty[currentDifficulty];
    let available = riddles.map((_, i) => i).filter(i => !usedIndices.includes(i));
    if (available.length === 0) { usedIndices = []; available = riddles.map((_, i) => i); }

    const idx     = available[Math.floor(Math.random() * available.length)];
    usedIndices.push(idx);
    currentRiddle = riddles[idx];

    document.getElementById("riddle-question").innerText = currentRiddle.question;

    const optionsDiv  = document.getElementById("riddle-options");
    const numericArea = document.getElementById("numeric-area");

    if (currentRiddle.numeric) {
        optionsDiv.innerHTML = "";
        optionsDiv.classList.add("hidden");
        numericArea.classList.remove("hidden");
        document.getElementById("numeric-answer-input").value    = "";
        document.getElementById("numeric-answer-input").disabled = false;
        document.getElementById("numeric-check-btn").disabled    = false;
        document.getElementById("numeric-error").innerText       = "";
    } else {
        numericArea.classList.add("hidden");
        optionsDiv.classList.remove("hidden");

        // Distractors חכמים — מוגדרים בריסיל, אחרת pool מאותה רמה
        let wrongAnswers;
        if (currentRiddle.distractors && currentRiddle.distractors.length >= 3) {
            wrongAnswers = [...currentRiddle.distractors]
                .sort(() => Math.random() - 0.5).slice(0, 3);
        } else {
            wrongAnswers = riddles
                .filter((_, i) => i !== idx && !riddles[i].numeric)
                .map(r => r.answer)
                .filter(a => a !== currentRiddle.answer)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);
        }

        const options = [currentRiddle.answer, ...wrongAnswers]
            .sort(() => Math.random() - 0.5);
        optionsDiv.innerHTML = "";
        options.forEach(opt => {
            const btn     = document.createElement("button");
            btn.innerText = opt;
            btn.className = "option-btn";
            btn.onclick   = () => checkAnswer(opt, currentRiddle.answer);
            optionsDiv.appendChild(btn);
        });
    }
}

// ── בדיקת תשובה ──
function checkAnswer(selected, correct) {
    if (riddleAnswered) return;
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;
        if (btn.innerText === correct)       btn.classList.add("correct");
        else if (btn.innerText === selected) btn.classList.add("wrong");
    });
    handleAnswerResult(selected === correct, correct);
}

function checkNumericInput() {
    if (riddleAnswered) return;
    const val     = document.getElementById("numeric-answer-input").value.trim();
    const errorEl = document.getElementById("numeric-error");
    if (val === "" || isNaN(Number(val))) {
        errorEl.innerText = "נסה לענות במספר 😊";
        return;
    }
    errorEl.innerText = "";
    document.getElementById("numeric-answer-input").disabled = true;
    document.getElementById("numeric-check-btn").disabled    = true;
    handleAnswerResult(Number(val) === Number(currentRiddle.answer), currentRiddle.answer);
}

function handleAnswerResult(isCorrect, correct) {
    riddleAnswered = true;
    const res = document.getElementById("riddle-result");
    if (isCorrect) {
        currentScore += POINTS_CORRECT;
        sessionCorrect++;
        document.getElementById("score-value").innerText = currentScore;
        res.innerText = "✅ כל הכבוד! ענית נכון! +" + POINTS_CORRECT + " נקודות";
        res.className = "result-correct";
        correctInLevel++;
        updateProgress();
        if (correctInLevel >= LEVEL_UP_AT) { setTimeout(showLevelUp, 1200); return; }
    } else {
        sessionWrong++;
        res.innerText = "❌ לא נכון. התשובה הנכונה: " + correct;
        res.className = "result-wrong";
    }
    document.getElementById("next-riddle-btn").classList.remove("hidden");
}

// ── עליית רמה ──
function showLevelUp() {
    const next        = difficultyConfig[currentDifficulty].next;
    const emojiEl     = document.getElementById("levelup-emoji");
    const continueBtn = document.getElementById("levelup-continue-btn");

    if (next === "king") {
        emojiEl.innerText     = "👑";
        document.getElementById("levelup-title").innerText = "👑 ברוכים הבאים לרמת מלך החידות!";
        document.getElementById("levelup-msg").innerText   =
            "מדהים " + currentUserName + "! עברת את כל הרמות!\n" +
            "עכשיו מגיעות החידות הקשות ביותר שיש!\nהאם אתה מוכן? 👑🧠";
        continueBtn.innerText = "▶️ המשיכו!";
    } else if (next === "genius") {
        emojiEl.innerText     = "🟣";
        document.getElementById("levelup-title").innerText = "🟣 ברוכים הבאים לרמת גאון!";
        document.getElementById("levelup-msg").innerText   =
            "וואו " + currentUserName + "! עברת שלוש רמות!\nהאם אתה מוכן? 🧠";
        continueBtn.innerText = "▶️ המשיכו!";
    } else if (next) {
        emojiEl.innerText     = "🎉";
        document.getElementById("levelup-title").innerText = "🎉 עלית לרמה הבאה!";
        document.getElementById("levelup-msg").innerText   =
            "מדהים " + currentUserName + "!\nפתרת " + LEVEL_UP_AT + " חידות נכון!\n" +
            "עוברים לרמה " + difficultyConfig[next].label + "!";
        continueBtn.innerText = "▶️ המשיכו!";
    } else {
        emojiEl.innerText     = "🏆";
        document.getElementById("levelup-title").innerText = "🏆 מלך החידות האמיתי! 🏆";
        document.getElementById("levelup-msg").innerText   =
            currentUserName + " — אתה מלך החידות האמיתי!\nאין כמוך! 👑🧠";
        continueBtn.innerText = "👑 שחק שוב";
        launchConfetti();
    }
    showScreen("levelup-screen");
}

function continueAfterLevelup() {
    const next = difficultyConfig[currentDifficulty].next;
    startRiddles(next || "king", true);
}

// ── סיכום ──
function showSummary() {
    let newlyUnlocked = [];
    if (currentUserName) {
        newlyUnlocked = upsertPlayer(currentUserName, currentScore, sessionCorrect, sessionWrong, sessionHighestLevel);
    }
    const saved       = currentUserName ? getPlayer(currentUserName) : null;
    const totalScore  = saved ? saved.score : currentScore;

    document.getElementById("summary-title").innerText = "🎉 כל הכבוד " + currentUserName + "!";
    document.getElementById("summary-stats").innerHTML =
        "<p>⭐ ניקוד הסשן: <strong>" + currentScore + "</strong></p>" +
        "<p>📊 סך הניקוד הכולל: <strong>" + totalScore + "</strong></p>" +
        "<p>✅ תשובות נכונות: <strong>" + sessionCorrect + "</strong></p>" +
        "<p>❌ תשובות שגויות: <strong>" + sessionWrong + "</strong></p>" +
        "<p>🏆 הרמה שהגעת: <strong>" + getLevelLabel(sessionHighestLevel) + "</strong></p>";

    const top5 = loadPlayers().sort((a, b) => b.score - a.score).slice(0, 5);
    document.getElementById("summary-leaderboard").innerHTML =
        top5.length > 0 ? buildLeaderboardHTML(top5) : "<p>אין שחקנים עדיין. 🌟</p>";

    showScreen("summary-screen");

    if (newlyUnlocked.length > 0) {
        showAchievementModal(newlyUnlocked[newlyUnlocked.length - 1]);
    }
}

// ── טבלת אלופים ──
function showLeaderboard() {
    const all  = loadPlayers().sort((a, b) => b.score - a.score);
    const top3 = all.slice(0, 3);
    document.getElementById("leaderboard-list").innerHTML =
        top3.length > 0 ? buildLeaderboardHTML(top3) : "<p>אין שחקנים עדיין. היה הראשון! 🌟</p>";

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekly  = all.filter(p => new Date(p.date) >= weekAgo).slice(0, 3);
    const sect    = document.getElementById("weekly-section");
    if (weekly.length > 0) {
        document.getElementById("weekly-list").innerHTML = buildLeaderboardHTML(weekly);
        sect.classList.remove("hidden");
    } else {
        sect.classList.add("hidden");
    }
    showScreen("leaderboard-screen");
}

function buildLeaderboardHTML(players) {
    const medals = ["🥇", "🥈", "🥉"];
    return players.map((p, i) => {
        const medal       = medals[i] || (i + 1) + ".";
        const isMe        = p.name.toLowerCase() === currentUserName.toLowerCase();
        const achievement = getAchievement(p.score);
        const badge       = achievement
            ? " <span class=\"achievement-badge\">" + achievement.label + "</span>"
            : "";
        return "<div class=\"leaderboard-row" + (isMe ? " leaderboard-me" : "") + "\">" +
            medal + " " + escapeHTML(p.name) + badge + " &mdash; " + p.score + " נק'" +
            "</div>";
    }).join("");
}

// ── מודל הישג ──
function showAchievementModal(achievement) {
    const emojiMap = { beginner: "🥉", champion: "🥈", genius: "🥇", king: "👑" };
    document.getElementById("achievement-emoji").innerText = emojiMap[achievement.key] || "🏅";
    document.getElementById("achievement-label").innerText = achievement.label;
    document.getElementById("achievement-modal").classList.remove("hidden");
}

function closeAchievementModal() {
    document.getElementById("achievement-modal").classList.add("hidden");
}

// ── קונפטי ──
function launchConfetti() {
    const container = document.getElementById("confetti-container");
    container.innerHTML = "";
    const colors = ["#e53935","#43a047","#fb8c00","#4fc3f7","#7b1fa2","#fdd835","#f06292","#26c6da"];
    for (let i = 0; i < 80; i++) {
        const p    = document.createElement("div");
        p.className = "confetti-piece";
        const size  = 8 + Math.random() * 12;
        p.style.left             = (Math.random() * 100) + "%";
        p.style.width            = size + "px";
        p.style.height           = size + "px";
        p.style.background       = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (1.5 + Math.random() * 2) + "s";
        p.style.animationDelay   = (Math.random() * 1.5) + "s";
        p.style.borderRadius     = Math.random() > 0.5 ? "50%" : "2px";
        container.appendChild(p);
    }
    setTimeout(() => { container.innerHTML = ""; }, 6000);
}

// ── בדיחה / סרט / שאל ──
function goToJoke()  { showScreen("joke-screen");  showJoke();  }
function showJoke()  { document.getElementById("joke-text").innerText  = jokes[Math.floor(Math.random() * jokes.length)]; }
function goToMovie() { showScreen("movie-screen"); showMovie(); }
function showMovie() { document.getElementById("movie-text").innerText = "🎬 אני ממליץ על: " + movies[Math.floor(Math.random() * movies.length)]; }

function goToAsk() {
    showScreen("ask-screen");
    document.getElementById("ask-input").value = "";
    document.getElementById("ask-answer").innerText = "";
    document.getElementById("ask-answer-card").classList.add("hidden");
}

function submitQuestion() {
    const q = document.getElementById("ask-input").value.trim().toLowerCase();
    if (!q) return;
    let answer;
    if (q.includes("שלום"))          answer = "שלום " + currentUserName + "! כיף לראות אותך! 😊";
    else if (q.includes("מה שלומך")) answer = "מצוין! אני ספארקי! 🤖";
    else if (q.includes("מי אתה"))   answer = "אני ספארקי, החבר החכם של " + currentUserName + "! 🦸";
    else                              answer = "עדיין לא למדתי לענות על זה, אבל אני כל הזמן משתפר! 💪";
    document.getElementById("ask-answer").innerText = answer;
    document.getElementById("ask-answer-card").classList.remove("hidden");
}

// ── אתחול ──
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("name-input").addEventListener("keydown", e => {
        if (e.key === "Enter") saveName();
    });
    document.getElementById("ask-input").addEventListener("keydown", e => {
        if (e.key === "Enter") submitQuestion();
    });
    document.getElementById("numeric-answer-input").addEventListener("keydown", e => {
        if (e.key === "Enter") checkNumericInput();
    });
    showScreen("name-screen");
});
