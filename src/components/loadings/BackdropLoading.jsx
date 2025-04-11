export default function FullScreenBackdropLoading({ loadingSpinner = false, loadingMessage = 'Loading...' }) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="flex flex-col items-center">
        {loadingSpinner && (
          <div className="animate-spin rounded-full h-16 w-16 mobile:h-14 mobile:w-14 border-t-4 border-teal-400 border-opacity-80"></div>
        )}
        <p className="mt-4 text-white text-base mobile:text-sm font-semibold">{loadingMessage}</p>
      </div>
    </div>
  );
}
