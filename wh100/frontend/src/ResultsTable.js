import React from "react";

const ResultsTable = ({ songs, handleAdd }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="overflow-x-auto pb-4">
        <div className="min-w-full inline-block align-middle">
          <div className="border rounded-lg border-gray-300">
            <div className="max-h-24 h-96 overflow-y-auto"> {/* Added max height and vertical scrollbar */}
              <table className="table-auto min-w-full rounded-xl">
                <tbody className="divide-y divide-gray-300">
                  {songs.map((song, index) => (
                    <tr key={song.id} className="bg-white transition-all duration-500 hover:bg-gray-10 dark:hover:bg-gray-600">
                      <td className="p-3 whitespace-nowrap text-right leading-6 font-medium text-gray-900">{index + 1}</td>
                      <td className="px-3 py-3 h-20">
                        <div className="flex items-center gap-3 w-60 break-words">
                          <img src={song.image_url} className="h-12 w-12 rounded-md object-cover" alt={song.name} />
                          <div className="data">
                            <p className="font-normal text-sm text-gray-900">{song.name}</p>
                            <p className="font-normal text-xs leading-5 text-gray-400"> {song.artist_names} </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                        <button onClick={() => handleAdd()} className="p-2 rounded-full bg-white group transition-all duration-500 hover:bg-red-600 flex item-center">
                          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="21" height="21" viewBox="0 0 24 24"
                            style={{ fill: '#40C057' }}>
                            <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z"></path>
                          </svg>
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
    </div>
  );
};

export default ResultsTable;
