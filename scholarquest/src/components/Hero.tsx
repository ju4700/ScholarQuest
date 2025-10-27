import { useState, useEffect } from 'react';

interface UserProfile {
    field: string;
    cgpa: number;
    budget: number;
    fullyFunded: boolean;
    degree: string;
    country: string;
}

interface Scholarship {
    id: number;
    title: string;
    country: string;
    deadline: string;
    amount: string;
    field: string;
    minCGPA: number;
    fullyFunded: boolean;
    eligibility: string;
    link: string;
    matchScore?: number;
}

function Hero() {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<UserProfile>({
        field: '',
        cgpa: 3.0,
        budget: 10000,
        fullyFunded: false,
        degree: '',
        country: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    const [scholarships, setScholarships] = useState<Scholarship[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const mockScholarships: Scholarship[] = [
        {
            id: 1,
            title: 'Erasmus Mundus Masters Scholarship',
            country: 'Europe',
            deadline: '2024-01-15',
            amount: 'Full Tuition + €1,400/month',
            field: 'CS',
            minCGPA: 3.5,
            fullyFunded: true,
            eligibility: 'Bachelor degree in CS or related field',
            link: '#'
        },
        {
            id: 2,
            title: 'DAAD Scholarship Germany',
            country: 'Germany',
            deadline: '2024-02-28',
            amount: '€850/month',
            field: 'Engineering',
            minCGPA: 3.2,
            fullyFunded: false,
            eligibility: 'Engineering graduates with relevant experience',
            link: '#'
        },
        {
            id: 3,
            title: 'Chevening Scholarship UK',
            country: 'UK',
            deadline: '2024-11-02',
            amount: 'Full Tuition + Living',
            field: 'All Fields',
            minCGPA: 3.3,
            fullyFunded: true,
            eligibility: 'Leadership potential and work experience required',
            link: '#'
        },
        {
            id: 4,
            title: 'Swedish Institute Scholarships',
            country: 'Sweden',
            deadline: '2024-02-20',
            amount: 'Full Tuition + SEK 10,000/month',
            field: 'CS',
            minCGPA: 3.4,
            fullyFunded: true,
            eligibility: 'Demonstrated leadership and academic excellence',
            link: '#'
        }
    ];

    useEffect(() => {
        const savedProfile = localStorage.getItem('scholarQuestProfile');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
    }, []);
    const saveProfile = () => {
        localStorage.setItem('scholarQuestProfile', JSON.stringify(profile));
    };
    const calculateMatchScore = (scholarship: Scholarship): number => {
        let score = 0;
        if (scholarship.field === profile.field || scholarship.field === 'All Fields') {
            score += 40;
        }
        if (profile.cgpa >= scholarship.minCGPA) {
            score += 30;
        } else {
            score += Math.max(0, 30 - ((scholarship.minCGPA - profile.cgpa) * 15));
        }
        if (profile.fullyFunded && scholarship.fullyFunded) {
            score += 30;
        } else if (!profile.fullyFunded) {
            score += 20;
        }

        return Math.round(score);
    };
    const getFilteredScholarships = () => {
        let filtered = mockScholarships.map(s => ({
            ...s,
            matchScore: calculateMatchScore(s)
        }));

        if (searchQuery) {
            filtered = filtered.filter(s =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.field.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterCountry) {
            filtered = filtered.filter(s => s.country === filterCountry);
        }

        return filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    };
    const handleSearch = () => {
        saveProfile();
        setIsAnimating(true);
        setTimeout(() => {
            setScholarships(getFilteredScholarships());
            setShowResults(true);
            setIsAnimating(false);
        }, 300);
    };
    const nextStep = () => {
        if (step < 3) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(step + 1);
                setIsAnimating(false);
            }, 150);
        }
    };
    const prevStep = () => {
        if (step > 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(step - 1);
                setIsAnimating(false);
            }, 150);
        }
    };
    const resetSearch = () => {
        setShowResults(false);
        setStep(1);
        setSearchQuery('');
        setFilterCountry('');
    };

    return (
        <div className="flex-1 flex flex-col w-full max-xl:px-2 ">
            <div className="max-xl:max-w-[1200px] max-w-[1400px] w-full mx-auto bg-base-200 rounded-[15px] border-1 border-gray-600 mt-2 mb-2 xl:overflow-hidden flex-1 flex flex-col">
                {!showResults ? (
                    <div className="flex-1 flex items-center justify-center lg:p-6 max-xl:p-2 max-xl:pt-6 max-xl:pb-6">
                        <div className="w-full max-w-2xl">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl mb-6 border border-primary/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold mb-3">
                                    Find Your Scholarship
                                </h1>
                                <p className="text-base-content/60">
                                    Complete the form below to discover personalized scholarship opportunities
                                </p>
                            </div>
                            <div className="bg-base-100 rounded-xl p-8 shadow-2xl border border-base-300/50">
                                {step === 1 && (
                                    <div className={`space-y-6 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
                                        <div className="border-l-4 border-primary pl-4 mb-6">
                                            <h2 className="text-xl font-bold mb-1">Academic Background</h2>
                                            <p className="text-base-content/60 text-sm">Tell us about your educational background</p>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Field of Study</span>
                                                <span className="label-text-alt text-error text-xs">Required</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all"
                                                value={profile.field}
                                                onChange={(e) => setProfile({...profile, field: e.target.value})}
                                            >
                                                <option value="" disabled>Choose your field of study</option>
                                                <option value="CS">Computer Science</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Business">Business & Management</option>
                                                <option value="Medicine">Medicine & Health Sciences</option>
                                                <option value="Arts">Arts & Humanities</option>
                                            </select>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Degree Level</span>
                                                <span className="label-text-alt text-error text-xs">Required</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all"
                                                value={profile.degree}
                                                onChange={(e) => setProfile({...profile, degree: e.target.value})}
                                            >
                                                <option value="" disabled>Select your degree level</option>
                                                <option value="Bachelor">Bachelor's Degree</option>
                                                <option value="Masters">Master's Degree</option>
                                                <option value="PhD">PhD / Doctorate</option>
                                            </select>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Current Result </span>
                                                <span className="label-text-alt">
                                                    <span className="text-lg font-bold text-primary">{profile.cgpa.toFixed(1)}</span>
                                                    <span className="text-lg text-base-content/60 ml-1">/ 4.0</span>
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="2.0"
                                                max="4.0"
                                                step="0.1"
                                                value={profile.cgpa}
                                                onChange={(e) => setProfile({...profile, cgpa: parseFloat(e.target.value)})}
                                                className="range range-primary w-full"
                                            />
                                            <div className="flex justify-between text-xs px-2 mt-2 text-base-content/60">
                                                <span>2.0</span>
                                                <span>3.0</span>
                                                <span>4.0</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className={`space-y-6 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
                                        <div className="border-l-4 border-primary pl-4 mb-6">
                                            <h2 className="text-xl font-bold mb-1">Your Preferences</h2>
                                            <p className="text-base-content/60 text-sm">Help us narrow down the best matches for you</p>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Preferred Country</span>
                                                <span className="label-text-alt text-xs text-base-content/60">Optional</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all"
                                                value={profile.country}
                                                onChange={(e) => setProfile({...profile, country: e.target.value})}
                                            >
                                                <option value="">Any Country</option>
                                                <option value="USA">United States</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Europe">Europe (General)</option>
                                            </select>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Annual Budget</span>
                                                <span className="label-text-alt">
                                                    <span className="text-2xl font-bold text-primary">${(profile.budget / 1000).toFixed(0)}k</span>
                                                    <span className="text-xs text-base-content/60 ml-1">USD</span>
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="50000"
                                                step="1000"
                                                value={profile.budget}
                                                onChange={(e) => setProfile({...profile, budget: parseInt(e.target.value)})}
                                                className="range range-primary"
                                            />
                                            <div className="flex justify-between text-xs px-2 mt-2 text-base-content/60 font-medium">
                                                <span>$0</span>
                                                <span>$12.5k</span>
                                                <span>$25k</span>
                                                <span>$37.5k</span>
                                                <span>$50k</span>
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <div className="bg-base-200/50 p-5 rounded-xl border border-base-300/50">
                                                <label className="label cursor-pointer justify-start gap-4 p-0">
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-primary"
                                                        checked={profile.fullyFunded}
                                                        onChange={(e) => setProfile({...profile, fullyFunded: e.target.checked})}
                                                    />
                                                    <div className="flex-1">
                                                        <span className="label-text font-semibold text-base block mb-1">Fully-Funded Scholarships Only</span>
                                                        <span className="text-xs text-base-content/60">Filter results to show only scholarships that cover full tuition and living expenses</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {step === 3 && (
                                    <div className={`space-y-6 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
                                        <div className="border-l-4 border-primary pl-4 mb-6">
                                            <h2 className="text-xl font-bold mb-1">Refine Your Search</h2>
                                            <p className="text-base-content/60 text-sm">Add keywords or filters to get more specific results</p>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Search Keywords</span>
                                                <span className="label-text-alt text-xs text-base-content/60">Optional</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Enter keywords (e.g., masters in Europe, STEM, merit-based)"
                                                    className="input input-bordered w-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all pl-11 pr-4"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Filter by Country</span>
                                                <span className="label-text-alt text-xs text-base-content/60">Optional</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full bg-base-200 focus:bg-base-100 focus:border-primary transition-all"
                                                value={filterCountry}
                                                onChange={(e) => setFilterCountry(e.target.value)}
                                            >
                                                <option value="">All Countries</option>
                                                <option value="USA">United States</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Europe">Europe</option>
                                            </select>
                                        </div>

                                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-primary shrink-0 w-5 h-5 mt-0.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <div>
                                                <p className="text-sm font-semibold mb-1">Profile Saved</p>
                                                <p className="text-xs text-base-content/70">Your preferences are automatically saved. You can return anytime to continue your search.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-3 mt-8 pt-6 border-t border-base-300/50">
                                    <button
                                        className="btn btn-outline flex-1 gap-2"
                                        onClick={prevStep}
                                        disabled={step === 1}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>

                                    {step < 3 ? (
                                        <button
                                            className="btn btn-primary flex-1 gap-2"
                                            onClick={nextStep}
                                            disabled={!profile.field || !profile.degree}
                                        >
                                            Continue
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary flex-1 gap-2"
                                            onClick={handleSearch}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Find Scholarships
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="sticky top-0 bg-base-200/95 backdrop-blur-sm z-10 pb-4 mb-6 border-b border-base-300">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-1">Your Scholarship Matches</h2>
                                        <p className="text-base-content/60">
                                            Found <span className="font-bold text-primary">{scholarships.length}</span> {scholarships.length === 1 ? 'scholarship' : 'scholarships'} matching your profile
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-outline gap-2"
                                        onClick={resetSearch}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        New Search
                                    </button>
                                </div>
                            </div>
                            {scholarships.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                                    {scholarships.map((scholarship, index) => (
                                        <div
                                            key={scholarship.id}
                                            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 animate-slide-up"
                                            style={{ animationDelay: `${index * 0.08}s` }}
                                        >
                                            <div className="card-body">
                                                <div className="flex justify-between items-start gap-3 mb-3">
                                                    <h3 className="card-title text-lg flex-1">{scholarship.title}</h3>
                                                    <div className="badge badge-primary badge-lg font-bold">{scholarship.matchScore}%</div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                                    <div>
                                                        <p className="text-base-content/60 text-xs mb-1">Country</p>
                                                        <p className="font-semibold">{scholarship.country}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-base-content/60 text-xs mb-1">Amount</p>
                                                        <p className="font-semibold">{scholarship.amount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-base-content/60 text-xs mb-1">Deadline</p>
                                                        <p className="font-semibold">{scholarship.deadline}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-base-content/60 text-xs mb-1">Field</p>
                                                        <p className="font-semibold">{scholarship.field}</p>
                                                    </div>
                                                </div>

                                                <div className="bg-base-200/50 p-3 rounded-lg mb-4">
                                                    <p className="text-xs text-base-content/60 mb-1">Eligibility</p>
                                                    <p className="text-sm">{scholarship.eligibility}</p>
                                                    <p className="text-xs text-base-content/60 mt-2">Min CGPA: <span className="font-semibold">{scholarship.minCGPA}</span></p>
                                                </div>

                                                <div className="card-actions justify-between items-center">
                                                    <div className="flex gap-2">
                                                        {scholarship.fullyFunded && (
                                                            <div className="badge badge-success gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                Fully Funded
                                                            </div>
                                                        )}
                                                    </div>
                                                    <a href={scholarship.link} className="btn btn-primary btn-sm gap-1">
                                                        Apply Now
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-base-300 rounded-full mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">No scholarships found</h3>
                                    <p className="text-base-content/60 mb-6">Try adjusting your search criteria or filters</p>
                                    <button className="btn btn-primary" onClick={resetSearch}>
                                        Start New Search
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Hero;