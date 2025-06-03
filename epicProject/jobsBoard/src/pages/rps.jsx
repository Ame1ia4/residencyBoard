import React, { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';

function RPSPage() {
    
    const [rankingList, setRankingList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [studentList, setStudentList] = useState([]);

    // holds whatever company the user picks from the dropdown
    const [selectedCompanyID, setSelectedCompanyID] = useState('');

    const [error, setError] = useState(null);

    useEffect(function () {
        async function loadData() {

        const rankings = await supabase
            .from('RankingCompany')
            .select('companyStaffID, studentID, rankNo');
    
        const companies = await supabase
            .from('ResidencyPartner')
            .select('companyStaffID, companyName');

        const students = await supabase
            .from('Student')
            .select('studentID, firstName, lastName');

        if (rankings.error || companies.error || students.error) {
            setError('Failed to load data.');
            return;
        }

        setRankingList(rankings.data);
        setCompanyList(companies.data);
        setStudentList(students.data);
        setError(null);
        }

        loadData();
    }, []);

    // getting the name of the selected company
    let selectedCompanyName = 'Unknown';
    for (let i = 0; i < companyList.length; i++) {
        if (companyList[i].companyStaffID === selectedCompanyID) {
        selectedCompanyName = companyList[i].companyName;
        break;
        }
    }

    // filtering the rankings 
    const companyRankings = rankingList
        .filter(function (row) {
        return row.companyStaffID === selectedCompanyID;
        })
        .sort(function (a, b) {
        return a.rankNo - b.rankNo; 
    });

    // function to get full name from student id
    function getStudentName(studentID) {
        for (let i = 0; i < studentList.length; i++) {
            if (studentList[i].studentID === studentID) {
                return studentList[i].firstName + ' ' + studentList[i].lastName;
            }
        }
        return 'Unknown';
    }

    return (
        <div className="home-main">
            <h2>Residency Partner Rankings</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* dropdown to pick a company */}
            {companyList.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                    <label>Select a company: </label>
                    <select
                        value={selectedCompanyID}
                        onChange={function (e) {
                            setSelectedCompanyID(e.target.value);
                        }}
                    >
            
                        <option value="">-- Select a Company --</option>
                        {companyList.map(function (company) {
                            return (
                                <option key={company.companyStaffID} value={company.companyStaffID}>
                                    {company.companyName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            {}
            {companyRankings.length > 0 && (
                <div>
                    <h3>{selectedCompanyName}'s Rankings</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <table border="1" cellPadding="6">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyRankings.map(function (row, index) {
                                    return (
                                        <tr key={index}>
                                            <td>{row.rankNo}</td>
                                            <td>{row.studentID}</td>
                                            <td>{getStudentName(row.studentID)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
  );
}

export default RPSPage;
