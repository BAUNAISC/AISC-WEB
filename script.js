// 1. HTML Elemanlarını Yakalama
const langToggle = document.getElementById('lang-toggle');

// 2. Tarayıcı Hafızasından Kayıtlı Dili Alma
// Eğer daha önce dil seçilmediyse varsayılan olarak 'tr' atanır.
let currentLang = localStorage.getItem('site_lang') || 'tr';

// 3. Sayfa Yüklendiğinde Çalışacak Kurulum
document.addEventListener('DOMContentLoaded', () => {
  // Hafızadaki dile göre Checkbox'ın konumunu ayarla
  if (currentLang === 'en') {
    langToggle.checked = true;
  } else {
    langToggle.checked = false;
  }

  // Sayfa açılışında ilgili dildeki JSON dosyasını yükle
  loadLanguage(currentLang);
});

// 4. Checkbox Değiştiğinde (onchange) Çalışan Fonksiyon
function toggleLanguage(checkbox) {
  // Checkbox seçili (true) ise 'en', değilse (false) 'tr' seçilir
  const selectedLang = checkbox.checked ? 'en' : 'tr';
  loadLanguage(selectedLang);
}

// 5. JSON Dosyasını Okuyup Sayfayı Güncelleyen Ana Fonksiyon
function loadLanguage(lang) {
  // JSON dosyasını çekiyoruz (Örn: lang/tr.json veya lang/en.json)
  fetch(`lang/${lang}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Dil dosyası yüklenemedi: lang/${lang}.json`);
      }
      return response.json();
    })
    .then(translations => {
      // A) Sayfadaki 'data-i18n' özniteliğine sahip TÜM elemanları bul
      const elements = document.querySelectorAll('[data-i18n]');

      // B) Her bir elemanın metnini JSON içindeki karşılığıyla değiştir
      elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
          element.textContent = translations[key];
        }
      });

      // C) Sayfa Sekme Başlığını (Title) Güncelle
      if (translations['site_title']) {
        document.title = translations['site_title'];
      }

      // D) Kullanıcının Seçtiği Dili Hafızaya Kaydet
      localStorage.setItem('site_lang', lang);
      currentLang = lang;

      // E) HTML etiketinin lang özniteliğini güncelle (<html lang="en">)
      document.documentElement.lang = lang;
    })
    .catch(error => {
      console.error('Dil yükleme hatası:', error);
    });
}