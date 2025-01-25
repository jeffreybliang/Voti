import React from "react";

const ResultsTable = ({ songs, handleAdd }) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto pb-4">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg border-gray-300">
            <table className="table-auto min-w-full rounded-xl">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900">#</th>
                  <th className="p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900">Name & Artist</th>
                  <th className="p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900">Release Date</th>
                  <th className="p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900">Image</th>
                  <th className="p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {songs.map((song, index) => (
                  <tr key={song.id} className="bg-white transition-all duration-500 hover:bg-gray-50">
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">{index + 1}</td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <div>
                        <p className="font-bold text-sm">{song.name}</p>
                        <p className="text-gray-500 text-xs">{song.artists}</p>
                      </div>
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">{song.release}</td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <img src={song.image} alt={song.name} className="h-12 w-12 rounded-md object-cover" />
                    </td>
                    <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                      <button
                        onClick={() => handleAdd(song)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-red-700"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
