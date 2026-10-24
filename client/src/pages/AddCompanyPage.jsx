import { useState } from 'react';
import { useCreateCustomerMutation } from '../services/rfqApi';

export default function AddCompanyPage() {
    const [companyName, setCompanyName] = useState('');
    const [createCustomer, { isLoading }] = useCreateCustomerMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCustomer({ company_name: companyName }).unwrap();
            alert('Perusahaan berhasil ditambahkan!');
            setCompanyName('');
        } catch (err) {
            alert(err?.data?.message || 'Gagal menambahkan perusahaan');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Tambah Perusahaan Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Perusahaan (PT / CV)
                        </label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Contoh: PT Jaya Sentosa"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:bg-blue-300"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan Perusahaan'}
                    </button>
                </form>
            </div>
        </div>
    );
}