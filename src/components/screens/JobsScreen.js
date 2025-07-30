"use client";
import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Phone,
  Package,
  Clock,
  Calendar,
  MapPin,
  FileText,
  Repeat,
} from "lucide-react";

export default function JobsScreen() {
    const navigate = useNavigate();
   const handleJobPress = (jobId) => {
    navigate(`/job/${jobId}/tracking`);
  };

  const handleNewBooking = () => {
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center gap-3 p-4">
        <button className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-gray-900">My Jobs</h1>
          <p className="text-xs text-gray-500 -mt-0.5">Manage all your shipments</p>
        </div>
        <div className="w-6 h-6" />
      </header>

      {/* Search + Filter */}
      <div className="px-4 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        <button className="p-2 border rounded-xl hover:bg-gray-50">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
          <button className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium whitespace-nowrap">
            Active (2)
          </button>
          <button className="px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 whitespace-nowrap">
            Upcoming (0)
          </button>
          <button className="px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 whitespace-nowrap">
            Past (5)
          </button>
        </div>
      </div>

      {/* Job Cards */}
      <main className="px-4 mt-3 pb-8 space-y-4">
        {/* First Job Card */}
        <article 
          className="rounded-2xl border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleJobPress('PP1002')}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">#PP1002</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                In Transit
              </span>
            </div>
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                // Handle menu click
              }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span className="text-gray-800 font-medium">65%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `65%` }}
              />
            </div>
          </div>

          {/* Session Info */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Start* 4.5 * 2020/3</span>
          </div>

          {/* Pickup */}
          <div className="mt-3 grid grid-cols-[18px_1fr] gap-x-2 gap-y-0.5 text-xs">
            <span className="text-green-500 mt-1">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="text-gray-500">Pickup</div>
            <span />
            <div className="text-gray-900">TOP Supply Centre, Industrial Zone</div>
            <span />
            <div className="text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Sarah Maker • +1 (800) 208-3000
            </div>
          </div>

          {/* Destination */}
          <div className="mt-3 grid grid-cols-[18px_1fr] gap-x-2 gap-y-0.5 text-xs">
            <span className="text-red-500 mt-1">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="text-gray-500">Destination</div>
            <span />
            <div className="text-gray-900">321 Road Slave, Mall District</div>
            <span />
            <div className="text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Namphill Lot • +1 (800) 806-063
            </div>
          </div>

          {/* Parcel Card */}
          <div className="mt-3 bg-blue-50 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
              <Package className="w-4 h-4" />
              <span>Furniture Delivery</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-[11px] text-gray-500">Apply</p>
                <p className="font-semibold">200€</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">Repeat</p>
                <p className="font-semibold">200€</p>
              </div>
            </div>
          </div>

          {/* ETA + Actions */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-amber-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">ETA: 30 min</span>
              </div>
              <button 
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle track live click
                }}
              >
                <FileText className="w-4 h-4 mr-1" />
                Track live
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button 
              className="bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleJobPress('PP1002');
              }}
            >
              <FileText className="w-4 h-4" />
              View Details
            </button>
            <button 
              className="border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                // Handle contact click
              }}
            >
              <Repeat className="w-4 h-4" />
              Contact
            </button>
          </div>
        </article>

        {/* Second Job Card */}
        <article 
          className="rounded-2xl border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleJobPress('PPS001')}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">#PPS001</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                In Transit
              </span>
            </div>
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                // Handle menu click
              }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span className="text-gray-800 font-medium">45%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `45%` }}
              />
            </div>
          </div>

          {/* Session Info */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Start* 10.5 * 2025/1</span>
          </div>

          {/* Pickup */}
          <div className="mt-3 grid grid-cols-[18px_1fr] gap-x-2 gap-y-0.5 text-xs">
            <span className="text-green-500 mt-1">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="text-gray-500">Pickup</div>
            <span />
            <div className="text-gray-900">Sydney CBD, NSW</div>
            <span />
            <div className="text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              John Smith • +1 (800) 123-456
            </div>
          </div>

          {/* Destination */}
          <div className="mt-3 grid grid-cols-[18px_1fr] gap-x-2 gap-y-0.5 text-xs">
            <span className="text-red-500 mt-1">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="text-gray-500">Destination</div>
            <span />
            <div className="text-gray-900">Parramatta, NSW</div>
            <span />
            <div className="text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Jane Doe • +1 (800) 789-012
            </div>
          </div>

          {/* Parcel Card */}
          <div className="mt-3 bg-blue-50 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
              <Package className="w-4 h-4" />
              <span>General Goods</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-[11px] text-gray-500">Apply</p>
                <p className="font-semibold">$40.00</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">Repeat</p>
                <p className="font-semibold">$45.00</p>
              </div>
            </div>
          </div>

          {/* ETA + Actions */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-amber-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">ETA: 30 min</span>
              </div>
              <button 
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle track live click
                }}
              >
                <FileText className="w-4 h-4 mr-1" />
                Track live
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button 
              className="bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleJobPress('PPS001');
              }}
            >
              <FileText className="w-4 h-4" />
              View Details
            </button>
            <button 
              className="border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                // Handle contact click
              }}
            >
              <Repeat className="w-4 h-4" />
              Contact
            </button>
          </div>
        </article>

        {/* Load more button */}
        <button 
          className="w-full py-3 text-blue-600 text-sm font-medium hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          onClick={handleNewBooking}
        >
          Create New Job
        </button>
      </main>
    </div>
  );
}