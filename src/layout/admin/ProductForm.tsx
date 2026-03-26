import React, { FormEvent, useState } from "react";
import RequireAdmin from "./RequireAdmin";

const ProductForm: React.FC<{}> = () => {

    const [product, setProduct] = useState({
        id: 0,
        name: '',
        description: '',
        listPrice: 0,
        sellingPrice: 0,
        quantity: 0,
        avgRating: null,
        brand: '',
        dimensions: '',
        material: ''
    })

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (event: FormEvent) => {

        event.preventDefault();
        const token = localStorage.getItem('token');
        fetch('http://localhost:8089/product',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(product)
            })

            .then(async (reponse) => {
                if (reponse.ok) {
                    const savedProduct = await reponse.json();

                    // Upload ảnh nếu có chọn
                    if (imageFile) {
                        const formData = new FormData();
                        formData.append('file', imageFile);
                        formData.append('isThumbnail', 'true');
                        await fetch(`http://localhost:8089/api/images/upload/${savedProduct.id}`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` },
                            body: formData
                        })
                    }


                    alert("Đã thêm sách thành công!");
                    setProduct({
                        id: 0,
                        name: '',
                        description: '',
                        listPrice: 0,
                        sellingPrice: 0,
                        quantity: 0,
                        avgRating: null,
                        brand: '',
                        dimensions: '',
                        material: ''
                    })
                }
            });
    }






    return (
        <div className="container row d-flex align-items-center justify-content-center">
            <div className="col-6">
                <h1>Thêm San Pham</h1>

                <form onSubmit={handleSubmit} className="form">
                    <input
                        type='hidden' // hidden là 1 thằng ẩn không cần quan tâm lắm
                        id='product'
                        value={product.id}
                    />
                    <label htmlFor='name'>Name</label>
                    <input
                        className="form-control"
                        type='text'
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })
                        }
                        required
                    />


                    <label htmlFor='description'>description</label>
                    <input
                        className="form-control"
                        type='text'
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })
                        }
                        required
                    />


                    <label htmlFor='listPrice'>listPrice</label>
                    <input
                        className="form-control"
                        type='number'
                        value={product.listPrice}
                        onChange={(e) => setProduct({ ...product, listPrice: parseFloat(e.target.value) })
                        }
                        required
                    />

                    <label htmlFor='sellingPrice'>sellingPrice</label>
                    <input
                        className="form-control"
                        type='number'
                        value={product.sellingPrice}
                        onChange={(e) => setProduct({ ...product, sellingPrice: parseFloat(e.target.value) })
                        }
                        required
                    />
                    <label htmlFor='quantity'>quantity</label>
                    <input
                        className="form-control"
                        type='number'
                        value={product.quantity}
                        onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })
                        }
                        required
                    />


                    <label htmlFor='brand'>brand</label>
                    <input
                        className="form-control"
                        type='text'
                        value={product.brand}
                        onChange={(e) => setProduct({ ...product, brand: e.target.value })
                        }
                        required
                    />


                    <label htmlFor='dimensions'>dimensions</label>
                    <input
                        className="form-control"
                        type='text'
                        value={product.dimensions}
                        onChange={(e) => setProduct({ ...product, dimensions: e.target.value })
                        }
                        required
                    />


                    <label htmlFor='material'>material</label>
                    <input
                        className="form-control"
                        type='text'
                        value={product.material}
                        onChange={(e) => setProduct({ ...product, material: e.target.value })
                        }
                        required
                    />
                    <label htmlFor='image'>Ảnh sản phẩm</label>
                    <input
                        className="form-control mb-3"
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                    />
                    {previewUrl && (
                        <img src={previewUrl} alt="Preview"
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '12px' }} />
                    )}
                    <button type="submit" className="btn btn-success mt-2   " >Lưu</button>

                </form>
            </div>
        </div>
    );
}

const ProductForm_Admin = RequireAdmin(ProductForm);

export default ProductForm_Admin;