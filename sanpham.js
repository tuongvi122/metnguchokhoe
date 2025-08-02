// Lấy dữ liệu sản phẩm từ API
async function fetchProducts() {
  const res = await fetch('/api/hangmuc');
  if (!res.ok) return [];
  return await res.json();
}

// Render 1 thẻ sản phẩm
function createProductCard(product, idx) {
  const div = document.createElement('div');
  div.className = 'product-card';
  div.innerHTML = `
    <img src="${product.hinhAnh}" alt="${product.tenDa}" loading="lazy" />
    <div class="name">${product.tenDa}</div>
    <button class="baogia-btn" data-idx="${idx}">Báo giá hạng mục</button>
  `;
  return div;
}

// Lấy bảng giá theo từng hạng mục
function renderHangMucTable(product) {
  const hangmucs = [
    { label: 'Lát nền', key: 'latNen' },
  { label: 'Cầu thang', key: 'cauThang' },
  { label: 'Tam cấp', key: 'tamCap' },
  { label: 'Bếp', key: 'bep' },
  { label: 'Mặt tiền', key: 'matTien' },
  { label: 'Cột', key: 'cot' },
];
  let rows = '';
  hangmucs.forEach((hm, idx) => {
    if (product[hm.key]) {
      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td>${hm.label}</td>
          <td>${product[hm.key]}</td>
          <td>${product[hm.key]}</td>
        </tr>
      `;
    }
  });
  return `
    <table class="price-table">
      <tr>
        <th>Stt</th>
        <th>Hạng mục</th>
        <th>Đơn giá cung cấp</th>
        <th>Đơn giá thi công</th>
      </tr>
      ${rows}
    </table>
  `;
}

// Hiển thị popup báo giá
function showPopup(product) {
  const popupBg = document.getElementById('popup-bg');
  const popup = document.getElementById('popup');
  popup.innerHTML = `
    <span class="close" id="close-popup">&times;</span>
    <div class="popup-title">ĐƠN GIÁ HẠNG MỤC</div>
    ${renderHangMucTable(product)}
    <div class="popup-note"><b>Ghi chú:</b> <span>Đơn giá hạng mục ở trên tạm tính, đơn giá chi tiết chính xác phụ thuộc vào khối lượng và tính chất</span></div>
    <div class="popup-actions">
      <button class="btn-xanh">Đơn giá chi tiết gia công</button>
      <button class="btn-xanhl">Nhận báo giá</button>
      <button class="btn-do">Liên hệ: 0908 221 117</button>
      <button class="btn-close">Đóng</button>
    </div>
  `;
  popupBg.style.display = 'block';

  // Đóng popup
  popup.querySelector('#close-popup').onclick = () => popupBg.style.display = 'none';
  popup.querySelector('.btn-close').onclick = () => popupBg.style.display = 'none';
  popup.querySelector('.btn-do').onclick = () => window.open('tel:0908221117', '_self');
}

// Main
document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchProducts();
  const marble = data.filter(p => (p.loaiDa || '').toLowerCase().includes('marble'));
  const granite = data.filter(p => (p.loaiDa || '').toLowerCase().includes('granite'));
  const artificial = data.filter(p => (p.loaiDa || '').toLowerCase().includes('nhân tạo'));

  // Render từng section
  const renderSection = (list, sectionId) => {
    const section = document.getElementById(sectionId);
    section.innerHTML = '';
    list.forEach((p, idx) => {
      const card = createProductCard(p, idx);
      section.appendChild(card);
    });
  };
  renderSection(marble, 'marble-section');
  renderSection(granite, 'granite-section');
  renderSection(artificial, 'artificial-section');

  // Gắn sự kiện cho tất cả nút "Báo giá hạng mục"
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.contains('baogia-btn')) {
      // Tìm sản phẩm đúng
      const idx = Number(e.target.getAttribute('data-idx'));
      let sp;
      if (e.target.closest('#marble-section')) sp = marble[idx];
      else if (e.target.closest('#granite-section')) sp = granite[idx];
      else if (e.target.closest('#artificial-section')) sp = artificial[idx];
      if (sp) showPopup(sp);
    }
  });

  // Đóng popup khi click ra ngoài
  document.getElementById('popup-bg').onclick = function (e) {
    if (e.target === this) this.style.display = 'none';
  };
});