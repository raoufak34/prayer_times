export default function Loading() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Prayer Times</h2>
          <p className="text-gray-500">Please wait while we fetch the latest prayer schedule...</p>
        </div>
      </div>
    )
  }
  