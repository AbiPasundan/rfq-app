export default function RfqTable({ rfqs, isLoading, error }) {
    if (isLoading) {
        return <p className="text-gray-500 text-center py-4">Memuat data RFQ...</p>;
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4">
                Gagal memuat data RFQ
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Daftar RFQ</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100">
                            <th className="py-3 px-6">ID</th>
                            <th className="py-3 px-6">Customer / Perusahaan</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6">Subtotal</th>
                            <th className="py-3 px-6">Tanggal Dibuat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {rfqs?.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-400">
                                    Belum ada data RFQ
                                </td>
                            </tr>
                        ) : (
                            rfqs?.map((rfq) => (
                                <tr key={rfq.id} className="hover:bg-gray-50 transition">
                                    <td className="py-4 px-6 font-medium text-gray-900">#{rfq.id}</td>
                                    <td className="py-4 px-6">{rfq.company_name}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                            {rfq.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-medium">
                                        Rp {Number(rfq.subtotal).toLocaleString('id-ID')}
                                    </td>
                                    <td className="py-4 px-6 text-gray-500">
                                        {new Date(rfq.created_at).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}