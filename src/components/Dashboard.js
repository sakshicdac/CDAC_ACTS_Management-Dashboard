// //------------ 19-12-24 use this 

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Pie, Bar, Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { Marker, MapContainer, TileLayer, Popup } from "react-leaflet";
// import pinImage from './assets/location.png';
// import "../App.css";

// ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

// const Dashboard = () => {
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [selectedBatch, setSelectedBatch] = useState("");
//     const [selectedCentre, setSelectedCentre] = useState("");
//     const [selectedCourse, setSelectedCourse] = useState("");
//     const [cityCoordinates, setCityCoordinates] = useState({});
//     const [genderData, setGenderData] = useState({});
//     const [totalStudents, setTotalStudents] = useState(0);
//     const [totalCourses, setTotalCourses] = useState(0);
//     const [batchEnrollmentData, setBatchEnrollmentData] = useState([]);
//     const [batchData, setBatchData] = useState([]);
//     const [selectedBatchTotal, setSelectedBatchTotal] = useState(0);
//     const [topCourse, setTopCourse] = useState(null);
//     const [cityDistributionData, setCityDistributionData] = useState({});
//     const [overallCourseData, setOverallCourseData] = useState({ labels: [], datasets: [] });

//     // Mapping course IDs to course names
//     const courseIdToNameMap = {
//         "TG_000001": "DAC",
//         "TG_000002": "DBDA",
//         "TG_000003": "HPC",
//         "TG_000004": "DITIS",
//     };

//     // Mapping gender IDs to gender names with IDs
//     const genderIdToNameMap = {
//         "UR_001": "Female",
//         "UR_002": "Male",
//     };
//     const batchIdToNameMap = {
//         "TG_000001": "DAC"
//    }

//     // Fetch data for total students and courses
//     useEffect(() => {
//         axios.get("http://localhost:5000/api/total-students")
//             .then(response => {
//                 console.log("Total Students Data:", response.data);
//                 setTotalStudents(response.data.total_students);
//             })
//             .catch(error => console.error("Error fetching total students", error));

//         axios.get("http://localhost:5000/api/total-courses")
//             .then(response => {
//                 console.log("Total Courses Data:", response.data);
//                 setTotalCourses(response.data.total_courses);
//             })
//             .catch(error => console.error("Error fetching total courses", error));

//         axios.get("http://localhost:5000/api/city-coordinates")
//             .then(response => {
//                 console.log("City Coordinates Data:", response.data);
//                 setCityCoordinates(response.data);
//             })
//             .catch(error => console.error("Error fetching city coordinates", error));

//         axios.get("http://localhost:5000/api/batch-enrollment")
//             .then(response => {
//                 console.log("Batch Enrollment Data:", response.data);
//                 setBatchEnrollmentData(response.data);
//             })
//             .catch(error => console.error("Error fetching batch enrollment data:", error));

//         axios.get("http://localhost:5000/api/city-wise-distribution")
//             .then((response) => {
//                 console.log("City-wise Distribution Data:", response.data);
//                 const cityCounts = response.data.reduce((acc, item) => {
//                     acc[item.city] = (acc[item.city] || 0) + item.student_count;
//                     return acc;
//                 }, {});

//                 const chartData = {
//                     labels: Object.keys(cityCounts),
//                     datasets: [{
//                         label: "City-wise Student Distribution",
//                         data: Object.values(cityCounts),
//                         backgroundColor: ["#F09EA7", "#F6CA94", "#FAFABE", "#C1EBC0", "#C7CAFF", "#CDABEB", "#F6C2F3"],
//                     }],
//                 };

//                 // eslint-disable-next-line no-undef
//                 setCityDistributionData(chartData);
//             })
//             .catch((error) => console.error("Error fetching city-wise student distribution", error));

//         axios.get("http://localhost:5000/api/course-enrollment-distribution")
//             .then(response => {
//                 if (response.data && Array.isArray(response.data)) {
//                     const transformedData = {
//                         labels: response.data.map(item => courseIdToNameMap[item.course_id]),
//                         datasets: [{
//                             data: response.data.map(item => item.enrollment_count),
//                             backgroundColor: ["#7495E3", "#94B3F2", "#AFE3C5", "#C9F0E2"],
//                         }],
//                     };

//                     console.log("Transformed Course Enrollment Data:", transformedData);
//                     // Debugging point
//                     setOverallCourseData(transformedData);
//                 } else {
//                     console.error("Unexpected API response:", response.data);
//                 }
//             })
//             .catch(error => console.error("Error fetching course enrollment data", error));

//         // Fetch batch selection data
//         axios.get('http://localhost:5000/api/batch-selection')
//             .then((response) => {
//                 setBatchData(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching batch selection data:', error);
//             });

//         // Fetch highest enrollment course
//         axios.get("http://localhost:5000/api/course-highest-enrollment")
//             .then((response) => {
//                 console.log("Highest Enrollment Course Data:", response.data);
//                 // Log the response
//                 setTopCourse(response.data); // Store the course data
//             })
//             .catch((error) => console.error("Error fetching course with highest enrollment:", error));
//     }, []);

//     // Empty dependency array means this runs once on mount
//     useEffect(() => {
//         axios.get("http://localhost:5000/api/gender-distribution")
//             .then(response => {
//                 const transformedData = response.data.reduce((acc, item) => {
//                     const genderId = item.gender || "Unknown"; // Default to "Unknown" if gender is missing
//                     const genderName = genderIdToNameMap[genderId]; // Map gender ID to name

//                     if (genderName) { // Only include mapped names
//                         const existingEntry = acc.find(entry => entry.gender === genderName);

//                         if (existingEntry) {
//                             existingEntry.count += item.count;
//                         } else {
//                             acc.push({ gender: genderName, count: item.count });
//                         }
//                     }

//                     return acc;
//                 }, []);

//                 const chartData = {
//                     labels: transformedData.map(item => item.gender),
//                     datasets: [{
//                         data: transformedData.map(item => item.count),
//                         backgroundColor: ["#987D9A", "#BB9AB1"],
//                     },],
//                 };

//                 setGenderData(chartData);
//             })
//             .catch(error => console.error("Error fetching gender data", error));
//     }, []);

//     // Filter data based on selected batch and update total students for that batch
//     useEffect(() => {
//         if (selectedBatch) {
//             const selectedBatchData = batchEnrollmentData.find(batch => batch.batch_name === selectedBatch);
//             console.log("Selected Batch Data:", selectedBatchData);
//             // Debugging line
//             setSelectedBatchTotal(selectedBatchData ? selectedBatchData.total_students : 0);
//         } else {
//             setSelectedBatchTotal(0);
//         }
//     }, [selectedBatch, batchEnrollmentData]);

//     // Handle dropdown changes for batch selection
//     const handleBatchChange = (event) => {
//         setSelectedBatch(event.target.value);
//     };

//     const pinIcon = new L.Icon({
//         iconUrl: pinImage,
//         iconSize: [30, 30],
//         iconAnchor: [15, 30],
//         popupAnchor: [0, -30],
//     });

//     return (
//         <div className="dashboard">
//             <div className="summary-row">
//                 <div className="widget">
//                     <strong>Total Students Enrolled</strong>
//                     <p>{totalStudents}</p>
//                 </div>
//                 <div className="widget">
//                     <strong>Total Number of Courses</strong>
//                     <p>{totalCourses}</p>
//                 </div>
//             </div>

//             <div className="sidebar">
//                 <h2>Menu Options</h2>
//                 <div className="dropdown-menu">
//                     <label>Select Batch</label>
//                     <select onChange={handleBatchChange} value={selectedBatch}>
//                         <option value="">All</option>
//                         {batchData.map(batch => (
//                             <option key={batch.batch_id} value={batch.batch_name}>{batch.batch_name}</option>
//                         ))}
//                     </select>

//                     <label>Select Centre</label>
//                     <select onChange={(e) => setSelectedCentre(e.target.value)} value={selectedCentre}>
//                         <option value="">All</option>
//                         <option value="TC_00001">CDAC_Bengaluru</option>
//                         <option value="TC_00002">CDAC_Hyderabad</option>
//                     </select>

//                     <label>Select Course</label>
//                     <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
//                         <option value="">All</option>
//                         {Object.entries(courseIdToNameMap).map(([id, name]) =>
//                             <option key={id} value={id}>{name}</option>)}
//                     </select>
//                 </div>
//             </div>

//             <div className="content">
//                 {/* Additional Charts based on filter selection */}
//                 {selectedBatch && (
//                     <>
//                         <div className="chart-row">
//                             {/* Gender Breakdown */}
//                             <div className="chart" style={{ width: '450px' }}>
//                                 <h3>Gender Breakdown:</h3>
//                                 {genderData && genderData.datasets && genderData.datasets.length > 0 ? (
//                                     <Pie data={genderData} />) : (
//                                     <div>No data available</div>)
//                                 }
//                             </div>

//                             {/* City-wise Student Distribution */}
//                             <div className="chart">
//                                 <h3>City-wise Student Distribution</h3>
//                                 {cityDistributionData.labels && cityDistributionData.labels.length > 0 ? (
//                                     <Bar data={cityDistributionData} options={{ responsive: true }} />) : (
//                                     <div>No data available for city-wise distribution</div>)
//                                 }
//                             </div>

//                             {/* Dynamic Batch Card */}
//                             {selectedBatch && (
//                                 <div className="chart">
//                                     <h3>Batch: {selectedBatch}</h3>
//                                     <div className="widget">
//                                         <strong>Total Students Enrolled in {selectedBatch}</strong>
//                                         <p>{selectedBatchTotal}</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Course-wise Enrollment */}
//                         <div className="filtered-chart-container">
//                             {/* Course-wise Enrollment Chart */}
//                             <div className="chart" >
//                                 <h3>Course-wise Enrollment</h3>
//                                 {/* Pass the overall course data */}
//                                 <Bar data={overallCourseData} options={{
//                                     responsive: true,
//                                     plugins: {
//                                         legend: { position: 'top' },
//                                         tooltip: { callbacks: { label(context) { return `${context.dataset.label}: ${context.raw}`; }, },
//                                         },
//                                     },
//                                     scales: {
//                                         x: { title: { display: true, text: 'Courses' } },
//                                         y: { title: { display: true, text: 'Enrollment Count' }, beginAtZero: true }
//                                     }
//                                 }} />
//                             </div>

//                             {/* Course with Highest Enrollment */}
//                             <div className="card" style={{ width: '350px' }}>
//                                 <h3>Course with Highest Enrollment</h3>
//                                 {topCourse ? (
//                                     <>
//                                         {/* Map topCourse ID to its name using the mapping */}
//                                         <p>Course: DAC<strong>{batchIdToNameMap[topCourse.batch_id] || topCourse.batch_id}</strong></p>
//                                         {/* Ensure topCourse has a property that corresponds to your mapping */}
//                                         <p>Enrollments: <strong>{topCourse.count}</strong></p>
//                                     </>
//                                 ) : (
//                                     <p>Loading...</p>
//                                 )}
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 {/* Overall Charts at the bottom */}
//                 <div className="overall-charts">
//                     {/* Overall Gender Distribution */}
//                     <div className="chart">
//                         <h3>Overall Gender Distribution</h3>
//                         {genderData && genderData.datasets && genderData.datasets.length > 0 ? (
//                             <Pie data={genderData} />) : (
//                             <div>No data available</div>)}
//                     </div>

//                     {/* Overall City-wise Distribution */}
//                     <div className="chart">
//                         <h3>Overall City-wise Distribution</h3>
//                         {Object.keys(cityCoordinates).length > 0 && (
//                             <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "250px", width: "480px" }}>
//                                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                                 {Object.entries(cityCoordinates).map(([city, coords]) => {
//                                     return (
//                                         <Marker key={city} position={[coords.latitude, coords.longitude]} icon={pinIcon}>
//                                             <Popup>{city}</Popup>
//                                         </Marker>
//                                     );
//                                 })}
//                             </MapContainer>
//                         )}
//                     </div>

//                     {/* Overall Course Enrollment Distribution */}
//                     <div className="chart">
//                         <h3>Overall Course Enrollment Distribution</h3>
//                         {/* Use Doughnut chart for overall course enrollment */}
//                         <Doughnut data={overallCourseData} />
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <footer className="footer">
//                     <p>© 2024 CDAC, All rights reserved.</p>
//                 </footer>

//             </div>
//         </div>
//     );
// };
// export default Dashboard;

//------------ 19-12-24 use this 

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Pie, Bar, Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { Marker, MapContainer, TileLayer, Popup } from "react-leaflet";
// import pinImage from './assets/location.png';
// import "../App.css";

// ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

// const Dashboard = () => {
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [selectedBatch, setSelectedBatch] = useState("");
//     const [selectedCentre, setSelectedCentre] = useState("");
//     const [selectedCourse, setSelectedCourse] = useState("");
//     const [cityCoordinates, setCityCoordinates] = useState({});
//     const [studentData, setStudentData] = useState([]);
//     const [loading, setLoading] = useState(true); // Loading state
//     const [genderData, setGenderData] = useState({});
//     const [totalStudents, setTotalStudents] = useState(0);
//     const [totalCourses, setTotalCourses] = useState(0);
//     const [batchEnrollmentData, setBatchEnrollmentData] = useState([]);
//     const [batchData, setBatchData] = useState([]);
//     const [selectedBatchTotal, setSelectedBatchTotal] = useState(0);
//     const [topCourse, setTopCourse] = useState(null);
//     const [cityDistributionData, setCityDistributionData] = useState({});
//     const [overallCourseData, setOverallCourseData] = useState({ labels: [], datasets: [] });

//     // Mapping course IDs to course names
//     const courseIdToNameMap = {
//         "TG_000001": "DAC",
//         "TG_000002": "DBDA",
//         "TG_000003": "HPC",
//         "TG_000004": "DITIS",
//     };

//     // Mapping gender IDs to gender names with IDs
//     const genderIdToNameMap = {
//         "UR_001": "Female",
//         "UR_002": "Male",
//     };
//     const batchIdToNameMap = {
//         "TG_000001": "DAC"
//    }

//    // Filter and set data based on the selected filters
// useEffect(() => {
//     // Filter gender data
//     const filteredGenderData = genderData.datasets ? genderData.datasets[0].data.filter((_, index) => {
//         // Add filtering logic here if necessary
//         return true; // Replace with your filter condition
//     }) : [];

//     // Filter city distribution data
//     const filteredCityData = cityDistributionData.labels ? cityDistributionData.labels.filter((_, index) => {
//         // Add your filter condition for city distribution
//         return true; // Replace with your filter condition
//     }) : [];

//     // Filter course enrollment data
//     const filteredCourseData = overallCourseData.labels ? overallCourseData.labels.filter((_, index) => {
//         // Add filter logic for course-wise enrollment
//         return true; // Replace with your filter condition
//     }) : [];

//     // Update the filtered data state
//     setFilteredData({
//         gender: filteredGenderData,
//         city: filteredCityData,
//         course: filteredCourseData,
//     });

// }, [selectedBatch, selectedCentre, selectedCourse, genderData, cityDistributionData, overallCourseData]);

//     // Fetch data for total students and courses
//     useEffect(() => {
//         axios.get("http://localhost:5000/api/total-students")
//             .then(response => {
//                 console.log("Total Students Data:", response.data);
//                 setTotalStudents(response.data.total_students);
//             })
//             .catch(error => console.error("Error fetching total students", error));

//         axios.get("http://localhost:5000/api/total-courses")
//             .then(response => {
//                 console.log("Total Courses Data:", response.data);
//                 setTotalCourses(response.data.total_courses);
//             })
//             .catch(error => console.error("Error fetching total courses", error));

//         axios.get("http://localhost:5000/api/city-coordinates")
//             .then(response => {
//                 console.log("City Coordinates Data:", response.data);
//                 setCityCoordinates(response.data);
//             })
//             .catch(error => console.error("Error fetching city coordinates", error));

//         axios.get("http://localhost:5000/api/batch-enrollment")
//             .then(response => {
//                 console.log("Batch Enrollment Data:", response.data);
//                 setBatchEnrollmentData(response.data);
//             })
//             .catch(error => console.error("Error fetching batch enrollment data:", error));

//         axios.get("http://localhost:5000/api/city-wise-distribution")
//             .then((response) => {
//                 console.log("City-wise Distribution Data:", response.data);
//                 const cityCounts = response.data.reduce((acc, item) => {
//                     acc[item.city] = (acc[item.city] || 0) + item.student_count;
//                     return acc;
//                 }, {});

//                 const chartData = {
//                     labels: Object.keys(cityCounts),
//                     datasets: [{
//                         label: "City-wise Student Distribution",
//                         data: Object.values(cityCounts),
//                         backgroundColor: ["#F09EA7", "#F6CA94", "#FAFABE", "#C1EBC0", "#C7CAFF", "#CDABEB", "#F6C2F3"],
//                     }],
//                 };

//                 // eslint-disable-next-line no-undef
//                 setCityDistributionData(chartData);
//             })
//             .catch((error) => console.error("Error fetching city-wise student distribution", error));

//         axios.get("http://localhost:5000/api/course-enrollment-distribution")
//             .then(response => {
//                 if (response.data && Array.isArray(response.data)) {
//                     const transformedData = {
//                         labels: response.data.map(item => courseIdToNameMap[item.course_id]),
//                         datasets: [{
//                             data: response.data.map(item => item.enrollment_count),
//                             backgroundColor: ["#7495E3", "#94B3F2", "#AFE3C5", "#C9F0E2"],
//                         }],
//                     };

//                     console.log("Transformed Course Enrollment Data:", transformedData);
//                     // Debugging point
//                     setOverallCourseData(transformedData);
//                 } else {
//                     console.error("Unexpected API response:", response.data);
//                 }
//             })
//             .catch(error => console.error("Error fetching course enrollment data", error));

//         // Fetch batch selection data
//         axios.get('http://localhost:5000/api/batch-selection')
//             .then((response) => {
//                 setBatchData(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching batch selection data:', error);
//             });

//         // Fetch highest enrollment course
//         axios.get("http://localhost:5000/api/course-highest-enrollment")
//             .then((response) => {
//                 console.log("Highest Enrollment Course Data:", response.data);
//                 // Log the response
//                 setTopCourse(response.data); // Store the course data
//             })
//             .catch((error) => console.error("Error fetching course with highest enrollment:", error));
//     }, []);

//     // Empty dependency array means this runs once on mount
//     useEffect(() => {
//         axios.get("http://localhost:5000/api/gender-distribution")
//             .then(response => {
//                 const transformedData = response.data.reduce((acc, item) => {
//                     const genderId = item.gender || "Unknown"; // Default to "Unknown" if gender is missing
//                     const genderName = genderIdToNameMap[genderId]; // Map gender ID to name

//                     if (genderName) { // Only include mapped names
//                         const existingEntry = acc.find(entry => entry.gender === genderName);

//                         if (existingEntry) {
//                             existingEntry.count += item.count;
//                         } else {
//                             acc.push({ gender: genderName, count: item.count });
//                         }
//                     }

//                     return acc;
//                 }, []);

//                 const chartData = {
//                     labels: transformedData.map(item => item.gender),
//                     datasets: [{
//                         data: transformedData.map(item => item.count),
//                         backgroundColor: ["#987D9A", "#BB9AB1"],
//                     },],
//                 };

//                 setGenderData(chartData);
//             })
//             .catch(error => console.error("Error fetching gender data", error));
//     }, []);

//     // Filter data based on selected batch and update total students for that batch
//     useEffect(() => {
//         if (selectedBatch) {
//             const selectedBatchData = batchEnrollmentData.find(batch => batch.batch_name === selectedBatch);
//             console.log("Selected Batch Data:", selectedBatchData);
//             // Debugging line
//             setSelectedBatchTotal(selectedBatchData ? selectedBatchData.total_students : 0);
//         } else {
//             setSelectedBatchTotal(0);
//         }
//     }, [selectedBatch, batchEnrollmentData]);

//     // Handle dropdown changes for batch selection
//     const handleBatchChange = (event) => {
//         setSelectedBatch(event.target.value);
//     };

//     // Fetch city coordinates to show student counts form each city
//   useEffect(() => {
//     fetch('http://localhost:5000/api/city-coordinates')
//       .then((response) => response.json())
//       .then((data) => {
//         setCityCoordinates(data); // Store city coordinates
//       })
//       .catch((error) => {
//         console.error('Error fetching city coordinates:', error);
//       });
//   }, []);

//   // Fetch student data, to show student counts (city-wise distribution)
//   useEffect(() => {
//     fetch('http://localhost:5000/api/city-wise-distribution')
//       .then((response) => response.json())
//       .then((data) => {
//         setStudentData(data); // Store student data
//         setLoading(false);  // Set loading to false once data is fetched
//       })
//       .catch((error) => {
//         console.error('Error fetching student data:', error);
//         setLoading(false);  // Stop loading in case of error
//       });
//   }, []);

//   // Check if the data is still loading
//   if (loading) {
//     return <div>Loading...</div>;
//   }


//     const pinIcon = new L.Icon({
//         iconUrl: pinImage,
//         iconSize: [30, 30],
//         iconAnchor: [15, 30],
//         popupAnchor: [0, -30],
//     });

//     return (
//         <div className="dashboard">
//             <div className="summary-row">
//                 <div className="widget">
//                     <strong>Total Students Enrolled</strong>
//                     <p>{totalStudents}</p>
//                 </div>
//                 <div className="widget">
//                     <strong>Total Number of Courses</strong>
//                     <p>{totalCourses}</p>
//                 </div>
//             </div>

//             <div className="sidebar">
//                 <h2>Menu Options</h2>
//                 <div className="dropdown-menu">
//                     <label>Select Batch</label>
//                     <select onChange={handleBatchChange} value={selectedBatch}>
//                         <option value="">All</option>
//                         {batchData.map(batch => (
//                             <option key={batch.batch_id} value={batch.batch_name}>{batch.batch_name}</option>
//                         ))}
//                     </select>

//                     <label>Select Centre</label>
//                     <select onChange={(e) => setSelectedCentre(e.target.value)} value={selectedCentre}>
//                         <option value="">All</option>
//                         <option value="TC_00001">C-DAC Bengaluru</option>
//                         <option value="TC_00002">C-DAC Hyderabad</option>
//                     </select>

//                     <label>Select Course</label>
//                     <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
//                         <option value="">All</option>
//                         {Object.entries(courseIdToNameMap).map(([id, name]) =>
//                             <option key={id} value={id}>{name}</option>)}
//                     </select>
//                 </div>
//             </div>

//             <div className="content">
//                 {/* Additional Charts based on filter selection */}
//                 {selectedBatch && (
//                     <>
//                         <div className="chart-row">
//                             {/* Gender Breakdown */}
//                             <div className="chart" style={{ width: '450px' }}>
//                                 <h3>Gender Breakdown:</h3>
//                                 {genderData && genderData.datasets && genderData.datasets.length > 0 ? (
//                                     <Pie data={genderData} />) : (
//                                     <div>No data available</div>)
//                                 }
//                             </div>

//                             {/* City-wise Student Distribution */}
//                             <div className="chart">
//                                 <h3>City-wise Student Distribution</h3>
//                                 {cityDistributionData.labels && cityDistributionData.labels.length > 0 ? (
//                                     <Bar data={cityDistributionData} options={{ responsive: true }} />) : (
//                                     <div>No data available for city-wise distribution</div>)
//                                 }
//                             </div>

//                             {/* Dynamic Batch Card */}
//                             {selectedBatch && (
//                                 <div className="chart">
//                                     <h3>Batch: {selectedBatch}</h3>
//                                     <div className="widget">
//                                         <strong>Total Students Enrolled in {selectedBatch}</strong>
//                                         <p>{selectedBatchTotal}</p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Course-wise Enrollment */}
//                         <div className="filtered-chart-container">
//                             {/* Course-wise Enrollment Chart */}
//                             <div className="chart" >
//                                 <h3>Course-wise Enrollment</h3>
//                                 {/* Pass the overall course data */}
//                                 <Bar data={overallCourseData} options={{
//                                     responsive: true,
//                                     plugins: {
//                                         legend: { position: 'top' },
//                                         tooltip: { callbacks: { label(context) { return `${context.dataset.label}: ${context.raw}`; }, },
//                                         },
//                                     },
//                                     scales: {
//                                         x: { title: { display: true, text: 'Courses' } },
//                                         y: { title: { display: true, text: 'Enrollment Count' }, beginAtZero: true }
//                                     }
//                                 }} />
//                             </div>

//                             {/* Course with Highest Enrollment */}
//                             <div className="card" style={{ width: '350px' }}>
//                                 <h3>Course with Highest Enrollment</h3>
//                                 {topCourse ? (
//                                     <>
//                                         {/* Map topCourse ID to its name using the mapping */}
//                                         <p>Course: DAC<strong>{batchIdToNameMap[topCourse.batch_id] || topCourse.batch_id}</strong></p>
//                                         {/* Ensure topCourse has a property that corresponds to your mapping */}
//                                         <p>Enrollments: <strong>{topCourse.count}</strong></p>
//                                     </>
//                                 ) : (
//                                     <p>Loading...</p>
//                                 )}
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 {/* Overall Charts at the bottom */}
//                 <div className="overall-charts">
//                     {/* Overall Gender Distribution */}
//                     <div className="chart">
//                         <h3>Overall Gender Distribution</h3>
//                         {genderData && genderData.datasets && genderData.datasets.length > 0 ? (
//                             <Pie data={genderData} />) : (
//                             <div>No data available</div>)}
//                     </div>

//                     {/* Overall City-wise Distribution */}
//                     <div className="chart">
//                         <h3>Overall City-wise Distribution</h3>
//                         {Object.keys(cityCoordinates).length > 0 && (
//                               <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "250px", width: "480px" }}>
//                               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                               {Object.entries(cityCoordinates).map(([city, coords]) => {
//                                 // Normalize city names to handle case inconsistencies
//                                 const normalizedCity = city.toUpperCase();
                        
//                                 // Find the student count for the current city from the student data
//                                 const cityInfo = studentData.find((data) => data.city.toUpperCase() === normalizedCity);
//                                 const studentCount = cityInfo ? cityInfo.student_count : 0; // Default to 0 if no data found
                        
//                                 return (
//                                   <Marker key={city} 
//                                   position={[coords.latitude, coords.longitude]} 
//                                   icon={pinIcon}>
//                                     <Popup>
//                                       {city} <br /> Students: {studentCount}
//                                     </Popup>
//                                   </Marker>
//                                 );
//                               })}
//                             </MapContainer>
//                         )}
//                     </div>

//                     {/* Overall Course Enrollment Distribution */}
//                     <div className="chart">
//                         <h3>Overall Course Enrollment Distribution</h3>
//                         {/* Use Doughnut chart for overall course enrollment */}
//                         <Doughnut data={overallCourseData} />
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <footer className="footer">
//                     <p>© 2024 CDAC, All rights reserved.</p>
//                 </footer>

//             </div>
//         </div>
//     );
// };
// export default Dashboard;
//--------------------------------------------------------------


// code with changed layout , centre, batch and course functionalities are to be added: 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, MapContainer, TileLayer, Popup } from "react-leaflet";
import pinImage from './assets/location.png';
import "../App.css";

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedCentre, setSelectedCentre] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [cityCoordinates, setCityCoordinates] = useState({});
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);
    const [genderData, setGenderData] = useState({});
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [batchEnrollmentData, setBatchEnrollmentData] = useState([]);
    const [batchData, setBatchData] = useState([]);
    const [selectedBatchTotal, setSelectedBatchTotal] = useState(0);
    const [topCourse, setTopCourse] = useState(null);
    const [cityDistributionData, setCityDistributionData] = useState({});
    const [overallCourseData, setOverallCourseData] = useState({ labels: [], datasets: [] });

    // Mapping course IDs to course names
    const courseIdToNameMap = {
        "TG_000001": "DAC",
        "TG_000002": "DBDA",
        "TG_000003": "HPC",
        "TG_000004": "DITIS",
    };

    // Mapping gender IDs to gender names with IDs
    const genderIdToNameMap = {
        "UR_001": "Female",
        "UR_002": "Male",
    };
    const batchIdToNameMap = {
        "TB_00000001": "March-2024",
        "TB_00000006": "September-2024",
        "TB_00000008": "August-2024",
        "TB_00000010": "August-2024",
   }

   // Filter and set data based on the selected filters
useEffect(() => {
    // Filter gender data
    const filteredGenderData = genderData.datasets ? genderData.datasets[0].data.filter((_, index) => {
        // Add filtering logic here if necessary
        return true; // Replace with your filter condition
    }) : [];

    // Filter city distribution data
    const filteredCityData = cityDistributionData.labels ? cityDistributionData.labels.filter((_, index) => {
        // Add your filter condition for city distribution
        return true; // Replace with your filter condition
    }) : [];

    // Filter course enrollment data
    const filteredCourseData = overallCourseData.labels ? overallCourseData.labels.filter((_, index) => {
        // Add filter logic for course-wise enrollment
        return true; // Replace with your filter condition
    }) : [];

    // Update the filtered data state
    setFilteredData({
        gender: filteredGenderData,
        city: filteredCityData,
        course: filteredCourseData,
    });

}, [selectedBatch, selectedCentre, selectedCourse, genderData, cityDistributionData, overallCourseData]);

    // Fetch data for total students and courses
    useEffect(() => {
        axios.get("http://localhost:5000/api/total-students")
            .then(response => {
                console.log("Total Students Data:", response.data);
                setTotalStudents(response.data.total_students);
            })
            .catch(error => console.error("Error fetching total students", error));

        axios.get("http://localhost:5000/api/total-courses")
            .then(response => {
                console.log("Total Courses Data:", response.data);
                setTotalCourses(response.data.total_courses);
            })
            .catch(error => console.error("Error fetching total courses", error));

        axios.get("http://localhost:5000/api/city-coordinates")
            .then(response => {
                console.log("City Coordinates Data:", response.data);
                setCityCoordinates(response.data);
            })
            .catch(error => console.error("Error fetching city coordinates", error));

        axios.get("http://localhost:5000/api/batch-enrollment")
            .then(response => {
                console.log("Batch Enrollment Data:", response.data);
                setBatchEnrollmentData(response.data);
            })
            .catch(error => console.error("Error fetching batch enrollment data:", error));

        axios.get("http://localhost:5000/api/city-wise-distribution")
            .then((response) => {
                console.log("City-wise Distribution Data:", response.data);
                const cityCounts = response.data.reduce((acc, item) => {
                    acc[item.city] = (acc[item.city] || 0) + item.student_count;
                    return acc;
                }, {});

                const chartData = {
                    labels: Object.keys(cityCounts),
                    datasets: [{
                        label: "City-wise Student Distribution",
                        data: Object.values(cityCounts),
                        backgroundColor: ["#F09EA7", "#F6CA94", "#FAFABE", "#C1EBC0", "#C7CAFF", "#CDABEB", "#F6C2F3"],
                    }],
                };

                // eslint-disable-next-line no-undef
                setCityDistributionData(chartData);
            })
            .catch((error) => console.error("Error fetching city-wise student distribution", error));

        axios.get("http://localhost:5000/api/course-enrollment-distribution")
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    const transformedData = {
                        labels: response.data.map(item => courseIdToNameMap[item.course_id]),
                        datasets: [{
                            data: response.data.map(item => item.enrollment_count),
                            backgroundColor: ["#7495E3", "#94B3F2", "#AFE3C5", "#C9F0E2"],
                        }],
                    };

                    console.log("Transformed Course Enrollment Data:", transformedData);
                    // Debugging point
                    setOverallCourseData(transformedData);
                } else {
                    console.error("Unexpected API response:", response.data);
                }
            })
            .catch(error => console.error("Error fetching course enrollment data", error));

        // Fetch batch selection data
        axios.get('http://localhost:5000/api/batch-selection')
            .then((response) => {
                setBatchData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching batch selection data:', error);
            });

        // Fetch highest enrollment course
        axios.get("http://localhost:5000/api/course-highest-enrollment")
    .then((response) => {
        console.log("Highest Enrollment Course Data:", response.data);
        setTopCourse(response.data); // Store the course data
    })
    .catch((error) => console.error("Error fetching course with highest enrollment:", error));
    }, []); // Empty dependency array means this runs once on mount

    
    useEffect(() => {
        axios.get("http://localhost:5000/api/gender-distribution")
            .then(response => {
                const transformedData = response.data.reduce((acc, item) => {
                    const genderId = item.gender || "Unknown"; // Default to "Unknown" if gender is missing
                    const genderName = genderIdToNameMap[genderId]; // Map gender ID to name

                    if (genderName) { // Only include mapped names
                        const existingEntry = acc.find(entry => entry.gender === genderName);

                        if (existingEntry) {
                            existingEntry.count += item.count;
                        } else {
                            acc.push({ gender: genderName, count: item.count });
                        }
                    }

                    return acc;
                }, []);

                const chartData = {
                    labels: transformedData.map(item => item.gender),
                    datasets: [{
                        data: transformedData.map(item => item.count),
                        backgroundColor: ["#987D9A", "#BB9AB1"],
                    },],
                };

                setGenderData(chartData);
            })
            .catch(error => console.error("Error fetching gender data", error));
    }, []);

    // Filter data based on selected batch and update total students for that batch
    useEffect(() => {
        if (selectedBatch) {
            const selectedBatchData = batchEnrollmentData.find(batch => batch.batch_name === selectedBatch);
            console.log("Selected Batch Data:", selectedBatchData);
            // Debugging line
            setSelectedBatchTotal(selectedBatchData ? selectedBatchData.total_students : 0);
        } else {
            setSelectedBatchTotal(0);
        }
    }, [selectedBatch, batchEnrollmentData]);

    // Handle dropdown changes for batch selection
    const handleBatchChange = (event) => {
        setSelectedBatch(event.target.value);
    };

    // Fetch city coordinates to show student counts form each city
  useEffect(() => {
    fetch('http://localhost:5000/api/city-coordinates')
      .then((response) => response.json())
      .then((data) => {
        setCityCoordinates(data); // Store city coordinates
      })
      .catch((error) => {
        console.error('Error fetching city coordinates:', error);
      });
  }, []);

  // Fetch student data, to show student counts (city-wise distribution)
  useEffect(() => {
    fetch('http://localhost:5000/api/city-wise-distribution')
      .then((response) => response.json())
      .then((data) => {
        setStudentData(data); // Store student data
        setLoading(false);  // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
        setLoading(false);  // Stop loading in case of error
      });
  }, []);

  // Check if the data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }
  

    const pinIcon = new L.Icon({
        iconUrl: pinImage,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    return (
        <div className="dashboard">
            <div className="summary-row">
                <div className="widget">
                    <strong>Total Students Enrolled</strong>
                    <p>{totalStudents}</p>
                </div>
                <div className="widget">
                    <strong>Total Number of Courses</strong>
                    <p>{totalCourses}</p>
                </div>
            </div>

            <div className="sidebar">
                <h2>Menu Options</h2>
                <div className="dropdown-menu">
                    <label>Select Batch</label>
                    <select onChange={handleBatchChange} value={selectedBatch}>
                        <option value="">All</option>
                        {batchData.map(batch => (
                            <option key={batch.batch_id} value={batch.batch_name}>{batch.batch_name}</option>
                        ))}
                    </select>

                    <label>Select Centre</label>
                    <select onChange={(e) => setSelectedCentre(e.target.value)} value={selectedCentre}>
                        <option value="">All</option>
                        <option value="TC_00001">C-DAC Bengaluru</option>
                        <option value="TC_00002">C-DAC Hyderabad</option>
                    </select>

                    <label>Select Course</label>
                    <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
                        <option value="">All</option>
                        {Object.entries(courseIdToNameMap).map(([id, name]) =>
                            <option key={id} value={id}>{name}</option>)}
                    </select>
                </div>
            </div>

            <div className="content">
                {/* Additional Charts based on filter selection */}
                {selectedBatch && (
                    <>
                        <div className="chart-row">
                            {/* Dynamic Batch Card */}
                            {selectedBatch && (
                                <div className="chart">
                                    <h3>Batch: {selectedBatch}</h3>
                                    <div className="widget">
                                        <strong>Total Students Enrolled in {selectedBatch}</strong>
                                        <p>{selectedBatchTotal}</p>
                                    </div>
                                </div>
                            )}
                    
                                {/* Course with Highest Enrollment */}
                                <div className="card" style={{ width: '350px' }}>
                                    <h3>Course with Highest Enrollment</h3>
                                    {topCourse ? (
                                        <>
                                            <p>
                                                Course: <strong>{courseIdToNameMap[topCourse.course] || 'Unkown Course'}</strong>
                                            </p>
                                            <p>Enrollments: <strong>{topCourse.count}</strong></p>
                                        </>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                            </div>

                        {/* Course-wise Enrollment */}
                        <div className="filtered-chart-container">
                            {/* Course-wise Enrollment Chart */}
                            <div className="chart" >
                                <h3>Course-wise Enrollment</h3>
                                {/* Pass the overall course data */}
                                <Bar data={overallCourseData} options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        tooltip: { callbacks: { label(context) { return `${context.dataset.label}: ${context.raw}`; }, },
                                        },
                                    },
                                    scales: {
                                        x: { title: { display: true, text: 'Courses' } },
                                        y: { title: { display: true, text: 'Enrollment Count' }, beginAtZero: true }
                                    }
                                }} />
                            </div>
                        {/* Gender Breakdown */}
                        <div className="chart" style={{ width: '450px' }}>
                                <h3>Gender Breakdown:</h3>
                                {genderData && genderData.datasets && genderData.datasets.length > 0 ? (
                                    <Pie data={genderData} />) : (
                                    <div>No data available</div>)
                                }
                            </div>

                            {/* City-wise Student Distribution */}
                            <div className="chart">
                                <h3>City-wise Student Distribution</h3>
                                {cityDistributionData.labels && cityDistributionData.labels.length > 0 ? (
                                    <Bar data={cityDistributionData} options={{ responsive: true }} />) : (
                                    <div>No data available for city-wise distribution</div>)
                                }
                            </div>
                            
                        </div>
                    </>
                )}

                {/* Overall Charts at the bottom */}
                <div className="overall-charts">
                    {/* Overall Gender Distribution */}
                    <div className="chart">
                        <h3>Overall Gender Distribution</h3>
                        {genderData && genderData.datasets && genderData.datasets.length > 0 ? (
                            <Pie data={genderData} />) : (
                            <div>No data available</div>)}
                    </div>

                    {/* Overall City-wise Distribution */}
                    <div className="chart">
                        <h3>Overall City-wise Distribution</h3>
                        {Object.keys(cityCoordinates).length > 0 && (
                              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "250px", width: "480px" }}>
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              {Object.entries(cityCoordinates).map(([city, coords]) => {
                                // Normalize city names to handle case inconsistencies
                                const normalizedCity = city.toUpperCase();
                        
                                // Find the student count for the current city from the student data
                                const cityInfo = studentData.find((data) => data.city.toUpperCase() === normalizedCity);
                                const studentCount = cityInfo ? cityInfo.student_count : 0; // Default to 0 if no data found
                        
                                return (
                                  <Marker key={city} 
                                  position={[coords.latitude, coords.longitude]} 
                                  icon={pinIcon}>
                                    <Popup>
                                      {city} <br /> Students: {studentCount}
                                    </Popup>
                                  </Marker>
                                );
                              })}
                            </MapContainer>
                        )}
                    </div>

                    {/* Overall Course Enrollment Distribution */}
                    <div className="chart">
                        <h3>Overall Course Enrollment Distribution</h3>
                        {/* Use Doughnut chart for overall course enrollment */}
                        <Doughnut data={overallCourseData} />
                    </div>
                </div>

                {/* Footer */}
                <footer className="footer">
                    <p>© 2024 CDAC, All rights reserved.</p>
                </footer>

            </div>
        </div>
    );
};
export default Dashboard;