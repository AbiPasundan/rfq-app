import { useState } from 'react';
import {
    useGetCustomersQuery,
    useGetRfqsQuery,
    useCreateRfqMutation,
} from '../services/rfqApi';
import RfqTable from '../components/RfqTable';

export default function CreateRfqPage() {
    const { data: customersData, isLoading: isLoadingCustomers } = useGetCustomersQuery();
    const { data: rfqsData, isLoading: isLoadingRfqs, error: errorRfqs } = useGetRfqsQuery();
    const [createRfq, { isLoading: isSubmitting }] = useCreateRfqMutation();

    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [sku, setSku] = useState('');
    const [productName, setProductName] = useState('');
    const [qty, setQty] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            customer_id: Number(selectedCustomer),
            idempotency_key: crypto.randomUUID(),
            status: 'DRAFT',
            items: [
                {
                    sku,
                    product_name: productName,
                    qty: Number(qty),
                    unit_price: Number(unitPrice),
                },
            ],
        };

        try {
            await createRfq(payload).unwrap();
            alert('RFQ Berhasil dibuat!');
            setSku('');
            setProductName('');
            setQty(1);
            setUnitPrice(0);
        } catch (err) {
            alert(err?.data?.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Buat RFQ Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pilih Customer
                        </label>
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            required
                            disabled={isLoadingCustomers}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        >
                            <option value="">-- Pilih Customer --</option>
                            {customersData?.data?.map((cust) => (
                                <option key={cust.id} value={cust.id}>
                                    {cust.company_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Qty)</label>
                            <input
                                type="number"
                                min="1"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
                            <input
                                type="number"
                                min="0"
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:bg-blue-300 mt-2"
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Submit RFQ'}
                    </button>
                </form>
            </div>

            <RfqTable
                rfqs={rfqsData?.data}
                isLoading={isLoadingRfqs}
                error={errorRfqs}
            />
        </div>
    );
}