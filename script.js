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

// 메일 앱이 열리지 않는 사람도 주소를 가져갈 수 있게 복사 버튼을 둡니다
const copyEmail = document.querySelector('.copy-email');

if (copyEmail) {
  const label = copyEmail.textContent;
  let timer;

  function copyWithSelection(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    return copied;
  }

  copyEmail.addEventListener('click', async () => {
    const email = copyEmail.dataset.email;
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      copied = copyWithSelection(email);
    }

    copyEmail.textContent = copied ? '복사했어요' : '복사 실패';
    clearTimeout(timer);
    timer = setTimeout(() => {
      copyEmail.textContent = label;
    }, 2000);
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
