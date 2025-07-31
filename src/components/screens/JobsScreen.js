"use client";
import React, { useState, useMemo } from "react";
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
  Star,
  MessageSquare
} from "lucide-react";

export default function JobsScreen() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleJobPress = (jobId) => {
        navigate(`/job/${jobId}/tracking`);
    };

    const handleNewBooking = () => {
        navigate('/booking');
    };

    // Sample job data for different tabs
    const activeJobs = [
        {
            id: 'PP1002',
            status: 'In Transit',
            progress: 65,
            driver: {
                initials: 'MJ',
                name: 'Mika Johansen',
                rating: 4.8,
                vehicle: 'Mike #4.2 "Poll Tango"'
            },
            date: 'Start* 4.5 * 2020/3',
            pickup: {
                location: 'TOP Supply Centre, Industrial Zone',
                contact: 'Sarah Maker • +1 (800) 208-3000'
            },
            destination: {
                location: '321 Road Slave, Mall District',
                contact: 'Namphill Lot • +1 (800) 806-063'
            },
            parcel: {
                type: 'Furniture Delivery',
                price: '200€',
                repeatPrice: '200€'
            },
            eta: '30 min'
        },
        {
            id: 'PPS001',
            status: 'In Transit',
            progress: 45,
            driver: {
                initials: 'MJ',
                name: 'Mika Johansen',
                rating: 4.8,
                vehicle: 'Mike #4.2 "Poll Tango"'
            },
            date: 'Start* 10.5 * 2025/1',
            pickup: {
                location: 'Sydney CBD, NSW',
                contact: 'John Smith • +1 (800) 123-456'
            },
            destination: {
                location: 'Parramatta, NSW',
                contact: 'Jane Doe • +1 (800) 789-012'
            },
            parcel: {
                type: 'General Goods',
                price: '$40.00',
                repeatPrice: '$45.00'
            },
            eta: '30 min'
        }
    ];

    const upcomingJobs = [
        {
            id: 'PPU001',
            status: 'Scheduled',
            progress: 0,
            driver: {
                initials: 'DR',
                name: 'David Robinson',
                rating: 4.5,
                vehicle: 'Van #7 "Blue Arrow"'
            },
            date: 'Start* 15.5 * 2025/2',
            pickup: {
                location: 'Central Warehouse, Industrial Park',
                contact: 'Robert Johnson • +1 (800) 111-222'
            },
            destination: {
                location: 'Downtown Business Center',
                contact: 'Emily Wilson • +1 (800) 333-444'
            },
            parcel: {
                type: 'Office Equipment',
                price: '$150.00',
                repeatPrice: '$160.00'
            },
            eta: 'Not started'
        }
    ];

    const pastJobs = [
        {
            id: 'PPP001',
            status: 'Completed',
            progress: 100,
            driver: {
                initials: 'TS',
                name: 'Taylor Smith',
                rating: 4.9,
                vehicle: 'Truck #12 "Big Red"'
            },
            date: 'Completed* 20.4 * 2025/1',
            pickup: {
                location: 'Main Distribution Center',
                contact: 'Michael Brown • +1 (800) 555-666'
            },
            destination: {
                location: 'Northside Shopping Mall',
                contact: 'Lisa Green • +1 (800) 777-888'
            },
            parcel: {
                type: 'Retail Inventory',
                price: '$75.00',
                repeatPrice: '$80.00'
            },
            eta: 'Completed'
        },
        {
            id: 'PPP002',
            status: 'Completed',
            progress: 100,
            driver: {
                initials: 'AJ',
                name: 'Anna Johnson',
                rating: 4.7,
                vehicle: 'Van #3 "Silver Bullet"'
            },
            date: 'Completed* 5.4 * 2025/1',
            pickup: {
                location: 'Southside Storage',
                contact: 'James Wilson • +1 (800) 999-000'
            },
            destination: {
                location: 'Eastside Apartments',
                contact: 'Sarah Davis • +1 (800) 123-999'
            },
            parcel: {
                type: 'Household Items',
                price: '$90.00',
                repeatPrice: '$95.00'
            },
            eta: 'Completed'
        }
    ];

    const getJobsForTab = () => {
        switch (activeTab) {
            case 'active':
                return activeJobs;
            case 'upcoming':
                return upcomingJobs;
            case 'past':
                return pastJobs;
            default:
                return activeJobs;
        }
    };

    // Filter jobs based on search query
    const filteredJobs = useMemo(() => {
        const jobs = getJobsForTab();
        if (!searchQuery.trim()) return jobs;

        const query = searchQuery.toLowerCase();
        return jobs.filter(job => 
            job.id.toLowerCase().includes(query) ||
            job.status.toLowerCase().includes(query) ||
            job.driver.name.toLowerCase().includes(query) ||
            job.pickup.location.toLowerCase().includes(query) ||
            job.destination.location.toLowerCase().includes(query) ||
            job.parcel.type.toLowerCase().includes(query)
        );
    }, [activeTab, searchQuery]);

    const getTabCount = (tab) => {
        switch (tab) {
            case 'active':
                return activeJobs.length;
            case 'upcoming':
                return upcomingJobs.length;
            case 'past':
                return pastJobs.length;
            default:
                return 0;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 max-w-sm mx-auto flex flex-col">
            {/* Top Bar */}
            <header className="flex items-center gap-3 p-4">
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="p-2 border rounded-xl hover:bg-gray-50">
                    <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* Tabs */}
            <div className="px-4 mt-3">
                <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
                    <button 
                        className={`px-3 py-1.5 rounded-full ${activeTab === 'active' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} font-medium whitespace-nowrap`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active ({getTabCount('active')})
                    </button>
                    <button 
                        className={`px-3 py-1.5 rounded-full ${activeTab === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} whitespace-nowrap`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming ({getTabCount('upcoming')})
                    </button>
                    <button 
                        className={`px-3 py-1.5 rounded-full ${activeTab === 'past' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'} whitespace-nowrap`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past ({getTabCount('past')})
                    </button>
                </div>
            </div>

            {/* Job Cards */}
            <main className="px-4 mt-3 pb-8 space-y-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <article 
                            key={job.id}
                            className="rounded-2xl border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleJobPress(job.id)}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">#{job.id}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        job.status === 'In Transit' ? 'bg-blue-100 text-blue-600' :
                                        job.status === 'Scheduled' ? 'bg-purple-100 text-purple-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                        {job.status}
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
                                    <span className="text-gray-800 font-medium">{job.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-2 ${
                                            job.status === 'In Transit' ? 'bg-blue-500' :
                                            job.status === 'Scheduled' ? 'bg-purple-500' :
                                            'bg-green-500'
                                        } rounded-full`}
                                        style={{ width: `${job.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-700 font-bold text-sm">
                                        {job.driver.initials}
                                    </div>

                                    {/* Partner Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">{job.driver.name}</span>
                                            <span className="text-xs text-gray-500">Driver</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {/* <div className="flex items-center text-xs text-yellow-600">
                                                <Star className="w-3 h-3 fill-yellow-400" />
                                                <span className="ml-1">{job.driver.rating}</span>
                                            </div> */}
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-600">{job.driver.vehicle}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {/* <div className="flex gap-1">
                                        <button 
                                            className="p-1.5 rounded-full bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Phone className="w-4 h-4" />
                                        </button>
                                        <button 
                                            className="p-1.5 rounded-full bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                            {/* Session Info */}
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{job.date}</span>
                            </div>

                            {/* Pickup */}
                            <div className="mt-3 grid grid-cols-[18px_1fr] gap-x-2 gap-y-0.5 text-xs">
                                <span className="text-green-500 mt-1">
                                    <MapPin className="w-4 h-4" />
                                </span>
                                <div className="text-gray-500">Pickup</div>
                                <span />
                                <div className="text-gray-900">{job.pickup.location}</div>
                                <span />
                                <div className="text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {job.pickup.contact}
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="mt-3 grid grid-cols-[18px_1fr] gap-x-2 gap-y-0.5 text-xs">
                                <span className="text-red-500 mt-1">
                                    <MapPin className="w-4 h-4" />
                                </span>
                                <div className="text-gray-500">Destination</div>
                                <span />
                                <div className="text-gray-900">{job.destination.location}</div>
                                <span />
                                <div className="text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {job.destination.contact}
                                </div>
                            </div>

                            {/* Parcel Card */}
                            <div className="mt-3 bg-blue-50 rounded-xl p-3 text-xs">
                                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                                    <Package className="w-4 h-4" />
                                    <span>{job.parcel.type}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-gray-700">
                                    <div>
                                        <p className="text-[11px] text-gray-500">Apply</p>
                                        <p className="font-semibold">{job.parcel.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-500">Repeat</p>
                                        <p className="font-semibold">{job.parcel.repeatPrice}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ETA + Actions */}
                            <div className="mt-3">
                                <div className={`flex justify-between items-center ${
                                    job.status === 'Completed' ? 'text-green-600 bg-green-50 border border-green-100' : 
                                    'text-amber-600 bg-amber-50 border border-amber-100'
                                } px-3 py-2 rounded-lg text-xs`}>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-medium">
                                            {job.status === 'Completed' ? 'Completed' : `ETA: ${job.eta}`}
                                        </span>
                                    </div>
                                    <button 
                                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle track live click
                                        }}
                                    >
                                        <FileText className="w-4 h-4 mr-1" />
                                        {job.status === 'Completed' ? 'View details' : 'Track live'}
                                    </button>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <button 
                                    className="bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleJobPress(job.id);
                                    }}
                                >
                                    <FileText className="w-4 h-4" />
                                    View Details
                                </button>
                                {/* <button 
                                    className="border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Repeat className="w-4 h-4" />
                                    Contact
                                </button> */}
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No jobs found matching your search
                    </div>
                )}

                {/* Load more button */}
                {activeTab === 'active' && filteredJobs.length > 0 && (
                    <button 
                        className="w-full py-3 text-blue-600 text-sm font-medium mt-4"
                    >
                        Load more jobs
                    </button>
                )}
            </main>
        </div>
    );
}