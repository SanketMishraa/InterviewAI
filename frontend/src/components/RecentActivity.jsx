export default function RecentActivity({ interviews }) {

    return (

        <div className="glass rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-5">
                Recent Interviews
            </h2>

            {interviews.length === 0 ? (

                <p>No Interviews Found.</p>

            ) : (

                interviews.map((item) => (

                    <div
                        key={item._id}
                        className="flex justify-between border-b border-slate-700 py-3"
                    >

                        <span>{item.role}</span>

                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>

                        <span>{item.score}/10</span>

                    </div>

                ))

            )}

        </div>

    );
}