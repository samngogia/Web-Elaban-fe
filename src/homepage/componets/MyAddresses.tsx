import React, { useEffect, useState } from 'react';
import vnData from '../../data/vietnam-administrative-units.json';

interface Address {
  id: number;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  addressType: 'HOME' | 'OFFICE';
  note?: string;
  isDefault: boolean;
}

interface AddressForm {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  addressType: 'HOME' | 'OFFICE';
  note: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressForm = {
  fullName: '', phone: '', province: '', district: '',
  ward: '', addressLine: '', addressType: 'HOME', note: '', isDefault: false,
};

const API = 'http://localhost:8089';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

const MyAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${API}/api/addresses`, { headers: authHeader() });
      if (res.ok) {
        const data = await res.json();
        console.log("Dữ liệu từ API:", data);
        // Nếu Spring Boot bọc mảng trong thuộc tính 'data'
        setAddresses(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMsg('');
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      fullName: addr.fullName, phone: addr.phone,
      province: addr.province, district: addr.district,
      ward: addr.ward, addressLine: addr.addressLine,
      addressType: addr.addressType, note: addr.note ?? '',
      isDefault: addr.isDefault,
    });
    setMsg('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.phone || !form.province || !form.district || !form.ward || !form.addressLine) {
      setMsg('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      setIsError(true);
      return;
    }
    if (!/^0[3|5|7|8|9]\d{8}$/.test(form.phone)) {
      setMsg('Số điện thoại không hợp lệ!');
      setIsError(true);
      return;
    }

    setIsSaving(true);
    try {
      const url = editingId ? `${API}/api/addresses/${editingId}` : `${API}/api/addresses`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(form) });

      if (res.ok) {
        setMsg(editingId ? 'Cập nhật thành công!' : 'Thêm địa chỉ thành công!');
        setIsError(false);
        setTimeout(() => { setShowForm(false); fetchAddresses(); }, 1000);
      } else {
        setMsg('Có lỗi xảy ra!'); setIsError(true);
      }
    } catch { setMsg('Lỗi kết nối!'); setIsError(true); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa địa chỉ này?')) return;
    await fetch(`${API}/api/addresses/${id}`, { method: 'DELETE', headers: authHeader() });
    fetchAddresses();
  };

  const handleSetDefault = async (id: number) => {
    await fetch(`${API}/api/addresses/${id}/default`, { method: 'PUT', headers: authHeader() });
    fetchAddresses();
  };

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f8f7f4', padding: '40px 0', fontFamily: 'sans-serif' },
    container: { maxWidth: 760, margin: '0 auto', padding: '0 20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    heading: { fontSize: 24, fontWeight: 400, color: '#1a1a1a' },
    addBtn: { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, cursor: 'pointer' },
    card: { background: '#fff', borderRadius: 12, border: '0.5px solid #e8e5e0', padding: '20px 24px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    name: { fontSize: 15, fontWeight: 500, color: '#1a1a1a', marginBottom: 4 },
    info: { fontSize: 13, color: '#666', marginBottom: 2 },
    badge: { display: 'inline-block', background: '#EAF3DE', color: '#27500A', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 500, marginLeft: 8 },
    officeBadge: { display: 'inline-block', background: '#E6F1FB', color: '#0C447C', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 500, marginLeft: 8 },
    actions: { display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0, marginLeft: 16 },
    editBtn: { background: 'none', border: '0.5px solid #ddd', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
    deleteBtn: { background: 'none', border: '0.5px solid #ffcdd2', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: '#d32f2f' },
    defaultBtn: { background: 'none', border: '0.5px solid #ddd', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: '#555' },
    empty: { textAlign: 'center' as const, padding: '60px', background: '#fff', borderRadius: 12, border: '0.5px solid #e8e5e0', color: '#aaa' },
    // Modal
    overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
    modal: { background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' as const, position: 'relative' as const },
    modalTitle: { fontSize: 18, fontWeight: 500, marginBottom: 24, color: '#1a1a1a' },
    closeBtn: { position: 'absolute' as const, top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' },
    label: { display: 'block', fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em' },
    input: { width: '100%', padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 13, marginBottom: 16, boxSizing: 'border-box' as const },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' },
    grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 12px' },
    saveBtn: { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 13, cursor: 'pointer' },
    cancelBtn: { background: 'none', border: '0.5px solid #ddd', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer', marginRight: 10 },
    typeBtn: { flex: 1, padding: '9px', border: '0.5px solid #ddd', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: '#fff' },
    typeBtnActive: { background: '#1a1a1a', color: '#fff', border: '0.5px solid #1a1a1a' },
  };

  // 1. Tìm object Tỉnh/Thành được chọn
  const selectedProvince = (vnData as any[]).find(p => p.Name === form.province);

  // 2. Lấy danh sách Quận/Huyện từ Tỉnh đã chọn
  const availableDistricts = selectedProvince?.Districts || [];

  // 3. Tìm object Quận/Huyện được chọn trong danh sách trên
  const selectedDistrict = availableDistricts.find((d: any) => d.Name === form.district);

  // 4. Lấy danh sách Phường/Xã từ Quận đã chọn
  const availableWards = selectedDistrict?.Wards || [];

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h2 style={s.heading}>Địa chỉ của tôi</h2>
          <button style={s.addBtn} onClick={openAdd}>+ Thêm địa chỉ mới</button>
        </div>

        {loading ? (
            <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '250px' }}>
                <div className="spinner-border text-secondary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted" style={{ fontSize: '15px', fontWeight: 500 }}>
                    Đang tải danh sách địa chỉ...
                </p>
            </div>
        ) : addresses.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
            <p>Bạn chưa có địa chỉ nào.</p>
            <button style={{ ...s.addBtn, marginTop: 16 }} onClick={openAdd}>
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} style={s.card}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <span style={s.name}>{addr.fullName}</span>
                  {addr.isDefault && <span style={s.badge}>Mặc định</span>}
                  <span style={addr.addressType === 'HOME' ? s.officeBadge : s.officeBadge}>
                    {addr.addressType === 'HOME' ? '🏠 Nhà riêng' : '🏢 Văn phòng'}
                  </span>
                </div>
                <div style={s.info}>{addr.phone}</div>
                <div style={s.info}>
                  {addr.addressLine}, {addr.ward}, {addr.district}, {addr.province}
                </div>
                {addr.note && (
                  <div style={{ ...s.info, color: '#aaa', fontStyle: 'italic', marginTop: 4 }}>
                    Ghi chú: {addr.note}
                  </div>
                )}
              </div>
              <div style={s.actions}>
                {!addr.isDefault && (
                  <button style={s.defaultBtn} onClick={() => handleSetDefault(addr.id)}>
                    Mặc định
                  </button>
                )}
                <button style={s.editBtn} onClick={() => openEdit(addr)}>Sửa</button>
                <button style={s.deleteBtn} onClick={() => handleDelete(addr.id)}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setShowForm(false)}>×</button>
            <div style={s.modalTitle}>
              {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </div>

            {msg && (
              <div style={{
                fontSize: 13, padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                background: isError ? '#FCEBEB' : '#EAF3DE',
                color: isError ? '#791F1F' : '#27500A'
              }}>{msg}</div>
            )}

            <div style={s.grid2}>
              <div>
                <label style={s.label}>HỌ VÀ TÊN *</label>
                <input style={s.input} value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>SỐ ĐIỆN THOẠI *</label>
                <input style={s.input} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div style={s.grid3}>
              {/* CHỌN TỈNH/THÀNH PHỐ */}
              <div>
                <label style={s.label}>TỈNH/THÀNH *</label>
                <select
                  style={s.input}
                  value={form.province}
                  onChange={e => {
                    setForm({
                      ...form,
                      province: e.target.value,
                      district: '', // Reset Quận khi đổi Tỉnh
                      ward: ''      // Reset Xã khi đổi Tỉnh
                    });
                  }}
                >
                  <option value="">-- Chọn Tỉnh/Thành --</option>
                  {(vnData as any[]).map((p: any) => (
                    <option key={p.Id} value={p.Name}>{p.Name}</option>
                  ))}
                </select>
              </div>

              {/* CHỌN QUẬN/HUYỆN */}
              <div>
                <label style={s.label}>QUẬN/HUYỆN *</label>
                <select
                  style={s.input}
                  value={form.district}
                  disabled={!form.province} // Khóa nếu chưa chọn Tỉnh
                  onChange={e => {
                    setForm({
                      ...form,
                      district: e.target.value,
                      ward: '' // Reset Xã khi đổi Quận
                    });
                  }}
                >
                  <option value="">-- Chọn Quận/Huyện --</option>
                  {availableDistricts.map((d: any) => (
                    <option key={d.Id} value={d.Name}>{d.Name}</option>
                  ))}
                </select>
              </div>

              {/* CHỌN PHƯỜNG/XÃ */}
              <div>
                <label style={s.label}>PHƯỜNG/XÃ *</label>
                <select
                  style={s.input}
                  value={form.ward}
                  disabled={!form.district} // Khóa nếu chưa chọn Quận
                  onChange={e => setForm({ ...form, ward: e.target.value })}
                >
                  <option value="">-- Chọn Phường/Xã --</option>
                  {availableWards.map((w: any) => (
                    <option key={w.Id} value={w.Name}>{w.Name}</option>
                  ))}
                </select>
              </div>
            </div>

            <label style={s.label}>SỐ NHÀ, TÊN ĐƯỜNG *</label>
            <input style={s.input} placeholder="VD: 123 Xuân Thủy"
              value={form.addressLine}
              onChange={e => setForm({ ...form, addressLine: e.target.value })} />

            <label style={s.label}>LOẠI ĐỊA CHỈ</label>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button
                style={{ ...s.typeBtn, ...(form.addressType === 'HOME' ? s.typeBtnActive : {}) }}
                onClick={() => setForm({ ...form, addressType: 'HOME' })}
              >🏠 Nhà riêng</button>
              <button
                style={{ ...s.typeBtn, ...(form.addressType === 'OFFICE' ? s.typeBtnActive : {}) }}
                onClick={() => setForm({ ...form, addressType: 'OFFICE' })}
              >🏢 Văn phòng</button>
            </div>

            <label style={s.label}>GHI CHÚ</label>
            <input style={s.input} placeholder="Tùy chọn"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <input type="checkbox" id="isDefault" checked={form.isDefault}
                onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
              <label htmlFor="isDefault" style={{ fontSize: 13, cursor: 'pointer' }}>
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={s.cancelBtn} onClick={() => setShowForm(false)}>Hủy</button>
              <button
                className="d-flex justify-content-center align-items-center"
                style={s.saveBtn}
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang lưu...
                  </>
                ) : (
                  'Lưu địa chỉ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddresses;