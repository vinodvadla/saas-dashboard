export const DashboardPreview = () => {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        {/* Dummy Dashboard Image Placeholder */}
        <div className="relative max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 transform -rotate-2">
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-zellbee-green rounded-full mx-auto flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="h-8 bg-zellbee-green rounded opacity-80"></div>
                  <div className="h-6 bg-zellbee-yellow rounded opacity-80"></div>
                  <div className="h-10 bg-zellbee-green rounded opacity-60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary overlay card */}
          <div className="absolute top-12 -right-4 bg-white rounded-xl shadow-lg p-4 transform rotate-3 opacity-75">
            <div className="bg-gray-50 rounded-lg h-32 w-48 flex items-center justify-center">
              <div className="w-8 h-8 bg-zellbee-green rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };