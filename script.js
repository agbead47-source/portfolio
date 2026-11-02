// 지금 보고 있는 항목을 메뉴에 표시합니다 (첫 페이지에서만 동작합니다)
const links = [...document.querySelectorAll('.nav a')];
const sections = links.map((link) => document.querySelector(link.hash));

function updateActive() {
  const line = window.innerHeight * 0.35;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  let current = 0;
  sections.forEach((section, i) => {
    if (section.getBoundingClientRect().top <= line) current = i;
  });
  if (atBottom) current = sections.length - 1;

  links.forEach((link, i) => {
    const on = i === current;
    link.classList.toggle('active', on);
    if (on) {
      link.setAttribute('aria-current', 'true');
      const nav = link.parentElement;
      nav.scrollLeft = link.offsetLeft - nav.offsetLeft - 16;
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if (sections.every(Boolean)) {
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
}

// data-image가 있는 버튼을 누르면 사진을 팝업으로 보여줍니다
const popup = document.querySelector('.image-popup');

if (popup) {
  const popupImage = popup.querySelector('.image-popup-image');
  const popupCaption = popup.querySelector('.image-popup-caption');

  document.querySelectorAll('[data-image]').forEach((button) => {
    button.addEventListener('click', () => {
      popupImage.src = button.dataset.image;
      popupImage.alt = `${button.dataset.caption} 화면`;
      popupCaption.textContent = button.dataset.caption;
      popup.showModal();
    });
  });

  popup.querySelector('.image-popup-close').addEventListener('click', () => popup.close());

  // 사진 바깥 어두운 부분을 눌러도 닫힙니다
  popup.addEventListener('click', (event) => {
    if (event.target === popup) popup.close();
  });
}

// 상세 페이지에서 돌아올 때는 바로 이동하고, 페이지 안에서 메뉴를 누를 때만 부드럽게 스크롤합니다
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 0);
  });
}
