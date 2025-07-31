"use client";
import React, { useState } from "react";
import { MapPin, ArrowLeft, Phone, Mail, FileText, Truck, Package, DollarSign, File, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeliveryTrackingScreen() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  const jobData = {
    id: "#PP1001",
    createdAt: "Today, 8:30 AM",
    eta: "2:45 PM",
    progress: 65
  };

  const MapSection = () => (
    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute top-6 left-6 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg z-10"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg z-10 animate-pulse"></div>
        <div className="absolute top-8 left-8 w-32 h-24 border-2 border-dashed border-blue-400 rounded-br-full opacity-60"></div>
      </div>
      <div className="relative z-10 text-center opacity-40">
        <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
    </div>
  );

  return (
    <main className="max-w-sm mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft  />
        </button>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Upload className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Job Info and Progress */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">#PP1001</h1>
            <p className="text-sm text-gray-500">Created Today, 8:30 AM</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            En Route
          </div>
        </div>
        <div className="mt-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Delivery Progress</span>
            <span className="text-xs text-gray-500">65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-4">
        <MapSection />
      </div>

      {/* Tabs */}
      <div className="px-4 py-4 space-y-4 text-[13px] text-gray-800 font-medium">
        <div className="flex justify-between text-sm border-b">
          {["overview", "tracking", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 pb-2 capitalize ${
                activeTab === tab ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Content */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Driver Info */}
            <div className="p-4 rounded-2xl border">
              <p className="text-xs text-gray-400 mb-2">Driver Information</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Mike Johnson</p>
                  <p className="text-xs text-gray-500">ABC 123 • Ford Transit</p>
                </div>
                <div className="flex gap-3 text-blue-600">
                  <Phone className="w-4 h-4" />
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Route Details */}
            <div className="p-4 rounded-2xl border space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Route Details</h3>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Pickup Location</h4>
                  <p className="text-sm text-gray-800">123 Warehouse District, Downtown LA</p>
                  <p className="text-sm text-gray-600">John Smith • +1 (555) 123-4567</p>
                  <div className="flex gap-4 mt-1">
                    <div>
                      <span className="text-xs text-gray-500">Scheduled: </span>
                      <span className="text-xs font-medium">9:30 AM</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Actual: </span>
                      <span className="text-xs font-medium text-green-600">9:35 AM</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                    Ring doorbell twice. Use loading dock entrance.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Destination</h4>
                  <p className="text-sm text-gray-800">456 Customer Plaza, Uptown Beverly Hills</p>
                  <p className="text-sm text-gray-600">TechCorp Inc - Reception • +1 (555) 987-6543</p>
                  <div className="flex gap-4 mt-1">
                    <div>
                      <span className="text-xs text-gray-500">Scheduled: </span>
                      <span className="text-xs font-medium">2:30 PM</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Estimated: </span>
                      <span className="text-xs font-medium text-blue-600">2:45 PM</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                    Deliver to front desk. Ask for Sarah from IT department.
                  </div>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="p-4 rounded-2xl border space-y-3 bg-blue-50">
              <h3 className="text-sm font-semibold text-gray-700">Package Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#4f74dd]">Type:</p>
                  <p className="text-sm font-medium">Electronics Package</p>
                </div>
                <div>
                  <p className="text-xs text-[#4f74dd]">Weight:</p>
                  <p className="text-sm font-medium">15 lbs</p>
                </div>
                <div>
                  <p className="text-xs text-[#4f74dd]">Dimensions:</p>
                  <p className="text-sm font-medium">12" x 8" x 6"</p>
                </div>
                <div>
                  <p className="text-xs text-[#4f74dd]">Value:</p>
                  <p className="text-sm font-medium">$1,245</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-[#4f74dd]">Description:</p>
                <p className="text-sm">Laptop computers (2 units) - Dell XPS 13</p>
              </div>
              <div className="mt-2 bg-[#dbeafe] p-2 rounded">
                <p className="text-xs text-[#4f74dd]">Special Instructions:</p>
                <div className="text-sm text-[#536dc2] p-2 rounded-lg ">
                  Fragile - Handle with care. Keep upright.
                </div>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="p-4 rounded-2xl border space-y-3 bg-white">
              <h3 className="text-sm font-semibold text-gray-700">Pricing Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Base Rate</span>
                  <span className="text-sm font-medium">$45.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Distance (24.8 miles)</span>
                  <span className="text-sm font-medium">$8.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Priority Fee</span>
                  <span className="text-sm font-medium">$12.00</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-sm font-semibold">$65.50</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Payment Status</span>
                  <span className="text-xs font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Pending</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Content */}
        {activeTab === "tracking" && (
          <div className="space-y-4">
            {/* Real-time Tracking */}
            <div className="p-4 rounded-2xl border bg-blue-50 ">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Real-time Tracking</h3>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Current Status</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Package is en route to destination</p>
                </div>
                <div className="text-sm font-medium text-blue-600">2:45 PM</div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live tracking active</span>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="p-4 rounded-2xl border">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Job created</span>
                      <span className="text-xs text-gray-500">8:30 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Driver assigned</span>
                      <span className="text-xs text-gray-500">9:15 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Package picked up</span>
                      <span className="text-xs text-gray-500">9:35 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">In transit - Highway 101</span>
                      <span className="text-xs text-gray-500">10:45 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Stopped for fuel</span>
                      <span className="text-xs text-gray-500">11:20 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Estimated delivery time</span>
                      <span className="text-xs text-gray-500">12:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distance and Duration */}
            <div className="p-4 rounded-2xl border bg-blue-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-lg font-bold">24.8 miles</p>
                  <p className="text-xs text-gray-500">Total Distance</p>
                </div>
                <div>
                  <p className="text-lg font-bold">45 min</p>
                  <p className="text-bold text-gray-500">Est. Duration</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Content */}
    {/* Documents Content */}
{activeTab === "documents" && (
  <div className="space-y-4">
    <div className="p-4 rounded-2xl border">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Documents & Receipts</h3>
      
      <div className="space-y-4">
        {/* Invoice Section */}
        <div className="p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Invoice #PP1001</p>
              <p className="text-xs text-gray-500">Amount: $65.50</p>
            </div>
          </div>
        </div>
        
        {/* Package Photos Section */}
        <div className="p-3 rounded-lg border">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium">Package Photos</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((item) => (
              <div key={item} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
        
        {/* Proof of Delivery Section */}
        <div className="p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Proof of Delivery</p>
              <p className="text-xs text-gray-500">Available after delivery</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pending Status */}
      <div className="mt-4 flex justify-end">
        <span className="text-xs font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Pending</span>
      </div>
    </div>
  </div>
)}
      </div>
    </main>
  );
}