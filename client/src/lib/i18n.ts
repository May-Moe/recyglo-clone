import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      // 🇺🇸 ENGLISH
      en: {
        translation: {
          nav: {
            home: "Home",
            about: "About Us",
            aboutRecyglo: "About RecyGlo",
            aboutDesc: "Learn about our mission, history, and team.",
            ourTeam: "Our Team",
            teamDesc: "Meet the people driving sustainability at RecyGlo.",
            impact: "See Our Impact",
            impactDesc: "Pioneering Sustainability in Action.",
            awards: "Awards & Recognition",
            awardsDesc: "Award-Winning Excellence & Global Recognition.",
            partnerships: "Strategic Partnerships",
            partnershipsDesc: "Strategic Partnerships & Industry Memberships.",
            solutions: "Our Solutions",
            allServices: "All Services",
            allServicesDesc: "View all our comprehensive sustainability solutions.",
            learnMore: "Learn more about this service.",
            resources: "Resources",
            articles: "Articles",
            platforms: "Platforms",
            carbonAccounting: "Carbon Accounting",
            carbonDesc: "Enterprise carbon footprint tracking and accounting platform.",
            wasteManagement: "Waste Management",
            wasteDesc: "Manage your waste operations and compliance workflows.",
            contact: "Contact Us",
            language: "Language",
            adminLogin: "Admin Login"
          }
        }
      },
      // 🇹🇭 THAI
      th: {
        translation: {
          nav: {
            home: "หน้าหลัก",
            about: "เกี่ยวกับเรา",
            aboutRecyglo: "เกี่ยวกับ RecyGlo",
            aboutDesc: "เรียนรู้เกี่ยวกับภารกิจ ประวัติ และทีมงานของเรา",
            ourTeam: "ทีมงานของเรา",
            teamDesc: "พบกับบุคลากรผู้ขับเคลื่อนความยั่งยืนที่ RecyGlo",
            impact: "ดูผลกระทบของเรา",
            impactDesc: "บุกเบิกความยั่งยืนในการปฏิบัติจริง",
            awards: "รางวัลและการยอมรับ",
            awardsDesc: "ความเป็นเลิศที่ได้รับรางวัลและการยอมรับระดับโลก",
            partnerships: "พันธมิตรเชิงกลยุทธ์",
            partnershipsDesc: "พันธมิตรเชิงกลยุทธ์และการเป็นสมาชิกในอุตสาหกรรม",
            solutions: "บริการของเรา",
            allServices: "บริการทั้งหมด",
            allServicesDesc: "ดูโซลูชันความยั่งยืนที่ครอบคลุมของเราทั้งหมด",
            learnMore: "เรียนรู้เพิ่มเติมเกี่ยวกับบริการนี้",
            resources: "แหล่งข้อมูล",
            articles: "บทความ",
            platforms: "แพลตฟอร์ม",
            carbonAccounting: "การบัญชีคาร์บอน",
            carbonDesc: "แพลตฟอร์มติดตามและจัดการคาร์บอนฟุตพริ้นท์สำหรับองค์กร",
            wasteManagement: "การจัดการของเสีย",
            wasteDesc: "จัดการการดำเนินงานด้านขยะและขั้นตอนการปฏิบัติตามข้อกำหนดของคุณ",
            contact: "ติดต่อเรา",
            language: "ภาษา",
            adminLogin: "เข้าสู่ระบบผู้ดูแล"
          }
        }
      },
      // 🇲🇲 MYANMAR
      my: {
        translation: {
          nav: {
            home: "ပင်မစာမျက်နှာ",
            about: "ကျွန်ုပ်တို့အကြောင်း",
            aboutRecyglo: "RecyGlo အကြောင်း",
            aboutDesc: "ကျွန်ုပ်တို့၏ ရည်မှန်းချက်၊ သမိုင်းကြောင်းနှင့် အဖွဲ့အကြောင်း လေ့လာရန်။",
            ourTeam: "ကျွန်ုပ်တို့၏ အဖွဲ့",
            teamDesc: "RecyGlo တွင် ရေရှည်တည်တံ့ခိုင်မြဲရေးကို ဦးဆောင်နေသူများနှင့် တွေ့ဆုံပါ။",
            impact: "ကျွန်ုပ်တို့၏ သက်ရောက်မှုကို ကြည့်ရန်",
            impactDesc: "လက်တွေ့တွင် ရေရှည်တည်တံ့ခိုင်မြဲရေးကို ဦးဆောင်နေခြင်း။",
            awards: "ဆုများနှင့် အသိအမှတ်ပြုမှုများ",
            awardsDesc: "ဆုရရှိထားသော ထူးချွန်မှုနှင့် ကမ္ဘာလုံးဆိုင်ရာ အသိအမှတ်ပြုမှု။",
            partnerships: "မဟာဗျူဟာမြောက် မိတ်ဖက်များ",
            partnershipsDesc: "မဟာဗျူဟာမြောက် မိတ်ဖက်များနှင့် လုပ်ငန်းဆိုင်ရာ အဖွဲ့ဝင်များ။",
            solutions: "ဖြေရှင်းချက်များ",
            allServices: "ဝန်ဆောင်မှုအားလုံး",
            allServicesDesc: "ကျွန်ုပ်တို့၏ ပြည့်စုံသော ရေရှည်တည်တံ့ခိုင်မြဲရေး ဖြေရှင်းချက်များကို ကြည့်ပါ။",
            learnMore: "ဤဝန်ဆောင်မှုအကြောင်း ပိုမိုလေ့လာရန်။",
            resources: "အရင်းအမြစ်များ",
            articles: "ဆောင်းပါးများ",
            platforms: "ပလပ်ဖောင်းများ",
            carbonAccounting: "ကာဗွန်စာရင်းကိုင်",
            carbonDesc: "လုပ်ငန်းသုံး ကာဗွန်ခြေရာခံခြင်းနှင့် စာရင်းကိုင်ပလပ်ဖောင်း။",
            wasteManagement: "စွန့်ပစ်ပစ္စည်း စီမံခန့်ခွဲမှု",
            wasteDesc: "သင်၏ စွန့်ပစ်ပစ္စည်း လုပ်ငန်းစဉ်များနှင့် စည်းမျဉ်းလိုက်နာမှုများကို စီမံခန့်ခွဲပါ။",
            contact: "ဆက်သွယ်ရန်",
            language: "ဘာသာစကား",
            adminLogin: "အက်ဒမင် အကောင့်ဝင်ရန်"
          }
        }
      },
      // 🇻🇳 VIETNAMESE
      vi: {
        translation: {
          nav: {
            home: "Trang chủ",
            about: "Về chúng tôi",
            aboutRecyglo: "Về RecyGlo",
            aboutDesc: "Tìm hiểu về sứ mệnh, lịch sử và đội ngũ của chúng tôi.",
            ourTeam: "Đội ngũ của chúng tôi",
            teamDesc: "Gặp gỡ những người thúc đẩy sự bền vững tại RecyGlo.",
            impact: "Xem Tác Động Của Chúng",
            impactDesc: "Tiên phong về Bền vững trong Thực tiễn.",
            awards: "Giải thưởng & Công nhận",
            awardsDesc: "Sự xuất sắc đạt giải thưởng & Công nhận toàn cầu.",
            partnerships: "Đối tác Chiến lược",
            partnershipsDesc: "Đối tác Chiến lược & Thành viên trong Ngành.",
            solutions: "Giải pháp",
            allServices: "Tất cả dịch vụ",
            allServicesDesc: "Xem tất cả các giải pháp bền vững toàn diện của chúng tôi.",
            learnMore: "Tìm hiểu thêm về dịch vụ này.",
            resources: "Tài nguyên",
            articles: "Bài viết",
            platforms: "Nền tảng",
            carbonAccounting: "Kế toán Carbon",
            carbonDesc: "Nền tảng theo dõi và kế toán dấu chân carbon cho doanh nghiệp.",
            wasteManagement: "Quản lý Chất thải",
            wasteDesc: "Quản lý hoạt động xử lý chất thải và quy trình tuân thủ của bạn.",
            contact: "Liên hệ",
            language: "Ngôn ngữ",
            adminLogin: "Đăng nhập Admin"
          }
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;