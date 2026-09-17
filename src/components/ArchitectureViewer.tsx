import React, { useState } from 'react';
import { Property, User, Review } from '../types';
import { 
  Database, Server, Smartphone, Code2, Terminal, 
  Play, Check, Copy, FileText, ChevronRight, Layers
} from 'lucide-react';

interface ArchitectureViewerProps {
  properties: Property[];
  users: User[];
  reviews: Review[];
}

export const ArchitectureViewer: React.FC<ArchitectureViewerProps> = ({
  properties,
  users,
  reviews
}) => {
  const [activeTab, setActiveTab] = useState<'api_tester' | 'database_tables' | 'code_viewer' | 'project_tree'>('api_tester');
  
  // API Tester states
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/properties');
  const [queryCity, setQueryCity] = useState<string>('Kota');
  const [queryType, setQueryType] = useState<string>('PG');
  const [queryMinRent, setQueryMinRent] = useState<string>('5000');
  const [queryMaxRent, setQueryMaxRent] = useState<string>('12000');
  const [queryGender, setQueryGender] = useState<string>('Boys');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number>(200);
  const [selectedDbTable, setSelectedDbTable] = useState<'properties' | 'users' | 'reviews' | 'favourites'>('properties');
  const [selectedCodeFile, setSelectedCodeFile] = useState<'schema.sql' | 'backend_server.js' | 'flutter_home.dart' | 'flutter_pubspec.yaml'>('backend_server.js');
  const [copiedCode, setCopiedCode] = useState(false);

  const executeApiQuery = () => {
    if (apiEndpoint === '/') {
      setResponseStatus(200);
      setApiResponse(JSON.stringify({
        app: "Where is my room India",
        status: "running"
      }, null, 2));
      return;
    }

    if (apiEndpoint === '/api/properties/:id') {
      const prop = properties[0];
      if (prop) {
        setResponseStatus(200);
        setApiResponse(JSON.stringify(prop, null, 2));
      } else {
        setResponseStatus(404);
        setApiResponse(JSON.stringify({ error: "Property not found" }, null, 2));
      }
      return;
    }

    // Simulate GET /api/properties with query params exactly as in server.js
    let filtered = properties.filter(p => p.available);
    if (queryCity) {
      filtered = filtered.filter(p => p.city.toLowerCase() === queryCity.toLowerCase());
    }
    if (queryType) {
      filtered = filtered.filter(p => p.property_type === queryType);
    }
    if (queryMinRent) {
      filtered = filtered.filter(p => p.rent >= Number(queryMinRent));
    }
    if (queryMaxRent) {
      filtered = filtered.filter(p => p.rent <= Number(queryMaxRent));
    }
    if (queryGender) {
      filtered = filtered.filter(p => p.gender === queryGender);
    }

    // ORDER BY verified DESC, created_at DESC
    filtered.sort((a, b) => {
      if (a.verified !== b.verified) return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      return b.id - a.id;
    });

    setResponseStatus(200);
    setApiResponse(JSON.stringify(filtered, null, 2));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Architecture & Live Backend Inspector
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                Express + PostgreSQL + Flutter
              </span>
            </h1>
            <p className="text-xs text-slate-400">Interactive testing for Express API, database schema, and Flutter client</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('api_tester')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'api_tester' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            API Playground
          </button>
          <button
            onClick={() => setActiveTab('database_tables')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'database_tables' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            PostgreSQL Tables
          </button>
          <button
            onClick={() => setActiveTab('code_viewer')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'code_viewer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Source Files
          </button>
          <button
            onClick={() => setActiveTab('project_tree')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'project_tree' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Project Tree
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-6">
        {/* TAB 1: API TESTER */}
        {activeTab === 'api_tester' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    Express.js Route Simulator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Executes dynamic queries matching the backend Express logic on PostgreSQL table `properties`
                  </p>
                </div>
                <button
                  id="run-api-query-btn"
                  onClick={executeApiQuery}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  Send Request
                </button>
              </div>

              {/* Endpoint Selector */}
              <div className="flex gap-2">
                <span className="px-3 py-2 bg-slate-800 text-emerald-400 font-mono font-bold text-xs rounded-xl flex items-center">
                  GET
                </span>
                <select
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="/api/properties">/api/properties (Filterable query)</option>
                  <option value="/api/properties/:id">/api/properties/101 (Single item)</option>
                  <option value="/">/ (Health check)</option>
                </select>
              </div>

              {/* Query Params if /api/properties */}
              {apiEndpoint === '/api/properties' && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono">?city=</label>
                    <input
                      type="text"
                      value={queryCity}
                      onChange={(e) => setQueryCity(e.target.value)}
                      placeholder="e.g. Kota"
                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono">&type=</label>
                    <select
                      value={queryType}
                      onChange={(e) => setQueryType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono text-xs"
                    >
                      <option value="">(All)</option>
                      <option value="PG">PG</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Room">Room</option>
                      <option value="Flat">Flat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono">&minRent=</label>
                    <input
                      type="number"
                      value={queryMinRent}
                      onChange={(e) => setQueryMinRent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono">&maxRent=</label>
                    <input
                      type="number"
                      value={queryMaxRent}
                      onChange={(e) => setQueryMaxRent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono">&gender=</label>
                    <select
                      value={queryGender}
                      onChange={(e) => setQueryGender(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white font-mono text-xs"
                    >
                      <option value="">(All)</option>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Co-ed">Co-ed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Response Console */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    HTTP Response &bull; Status: {responseStatus} OK
                  </span>
                </div>
                {apiResponse && (
                  <button
                    onClick={() => handleCopy(apiResponse)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy JSON
                  </button>
                )}
              </div>

              <div className="p-4 max-h-96 overflow-y-auto font-mono text-xs text-emerald-400 bg-slate-950">
                <pre>{apiResponse || 'Click "Send Request" to test the Express query engine...'}</pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATABASE TABLES */}
        {activeTab === 'database_tables' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">PostgreSQL Tables in Schema:</span>
              </div>
              <div className="flex gap-1.5">
                {(['properties', 'users', 'reviews'] as const).map(tbl => (
                  <button
                    key={tbl}
                    onClick={() => setSelectedDbTable(tbl)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      selectedDbTable === tbl ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tbl} ({tbl === 'properties' ? properties.length : tbl === 'users' ? users.length : reviews.length})
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    {selectedDbTable === 'properties' && (
                      <tr>
                        <th className="px-3 py-2.5">id</th>
                        <th className="px-3 py-2.5">title</th>
                        <th className="px-3 py-2.5">city</th>
                        <th className="px-3 py-2.5">type</th>
                        <th className="px-3 py-2.5">rent</th>
                        <th className="px-3 py-2.5">gender</th>
                        <th className="px-3 py-2.5">food</th>
                        <th className="px-3 py-2.5">wifi</th>
                        <th className="px-3 py-2.5">ac</th>
                        <th className="px-3 py-2.5">verified</th>
                        <th className="px-3 py-2.5">available</th>
                      </tr>
                    )}
                    {selectedDbTable === 'users' && (
                      <tr>
                        <th className="px-3 py-2.5">id</th>
                        <th className="px-3 py-2.5">name</th>
                        <th className="px-3 py-2.5">email</th>
                        <th className="px-3 py-2.5">phone</th>
                        <th className="px-3 py-2.5">user_type</th>
                      </tr>
                    )}
                    {selectedDbTable === 'reviews' && (
                      <tr>
                        <th className="px-3 py-2.5">id</th>
                        <th className="px-3 py-2.5">property_id</th>
                        <th className="px-3 py-2.5">user_name</th>
                        <th className="px-3 py-2.5">rating</th>
                        <th className="px-3 py-2.5">review</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedDbTable === 'properties' && properties.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 font-bold text-indigo-400">{p.id}</td>
                        <td className="px-3 py-2 max-w-xs truncate text-white">{p.title}</td>
                        <td className="px-3 py-2">{p.city}</td>
                        <td className="px-3 py-2">{p.property_type}</td>
                        <td className="px-3 py-2 font-bold text-emerald-400">₹{p.rent}</td>
                        <td className="px-3 py-2">{p.gender}</td>
                        <td className="px-3 py-2">{p.food_available ? 'TRUE' : 'FALSE'}</td>
                        <td className="px-3 py-2">{p.wifi ? 'TRUE' : 'FALSE'}</td>
                        <td className="px-3 py-2">{p.ac ? 'TRUE' : 'FALSE'}</td>
                        <td className="px-3 py-2 text-emerald-400">{p.verified ? 'TRUE' : 'FALSE'}</td>
                        <td className="px-3 py-2">{p.available ? 'TRUE' : 'FALSE'}</td>
                      </tr>
                    ))}

                    {selectedDbTable === 'users' && users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 font-bold text-indigo-400">{u.id}</td>
                        <td className="px-3 py-2 text-white">{u.name}</td>
                        <td className="px-3 py-2 text-slate-400">{u.email}</td>
                        <td className="px-3 py-2">{u.phone}</td>
                        <td className="px-3 py-2 uppercase font-bold text-indigo-300">{u.user_type}</td>
                      </tr>
                    ))}

                    {selectedDbTable === 'reviews' && reviews.map(r => (
                      <tr key={r.id} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 font-bold text-indigo-400">{r.id}</td>
                        <td className="px-3 py-2">{r.property_id}</td>
                        <td className="px-3 py-2 text-white">{r.user_name}</td>
                        <td className="px-3 py-2 text-amber-400 font-bold">★ {r.rating}</td>
                        <td className="px-3 py-2 max-w-sm truncate text-slate-300">{r.review}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOURCE FILES */}
        {activeTab === 'code_viewer' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="flex gap-2">
                {[
                  { id: 'backend_server.js', label: 'backend/server.js' },
                  { id: 'schema.sql', label: 'database/schema.sql' },
                  { id: 'flutter_home.dart', label: 'mobile/lib/main.dart' },
                  { id: 'flutter_pubspec.yaml', label: 'mobile/pubspec.yaml' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedCodeFile(f.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      selectedCodeFile === f.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950">
                <pre>
                  {selectedCodeFile === 'backend_server.js' && `const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.get("/", (req, res) => {
    res.json({
        app: "Where is my room India",
        status: "running"
    });
});

app.get("/api/properties", async (req, res) => {
    try {
        const { city, type, minRent, maxRent, gender } = req.query;
        let query = "SELECT * FROM properties WHERE available = true";
        const values = [];
        let index = 1;

        if (city) {
            query += \` AND LOWER(city) = LOWER($\${index++})\`;
            values.push(city);
        }
        if (type) {
            query += \` AND property_type = $\${index++}\`;
            values.push(type);
        }
        if (minRent) {
            query += \` AND rent >= $\${index++}\`;
            values.push(minRent);
        }
        if (maxRent) {
            query += \` AND rent <= $\${index++}\`;
            values.push(maxRent);
        }
        if (gender) {
            query += \` AND gender = $\${index++}\`;
            values.push(gender);
        }

        query += " ORDER BY verified DESC, created_at DESC";
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Unable to load properties" });
    }
});`}

                  {selectedCodeFile === 'schema.sql' && `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    user_type VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    property_type VARCHAR(30) NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(150),
    address TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    rent INTEGER NOT NULL,
    security_deposit INTEGER DEFAULT 0,
    available_from DATE,
    gender VARCHAR(20),
    food_available BOOLEAN DEFAULT FALSE,
    wifi BOOLEAN DEFAULT FALSE,
    ac BOOLEAN DEFAULT FALSE,
    laundry BOOLEAN DEFAULT FALSE,
    attached_bathroom BOOLEAN DEFAULT FALSE,
    description TEXT,
    verified BOOLEAN DEFAULT FALSE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favourites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    property_id INTEGER REFERENCES properties(id),
    UNIQUE(user_id, property_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    property_id INTEGER REFERENCES properties(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}

                  {selectedCodeFile === 'flutter_home.dart' && `import 'package:flutter/material.dart';

void main() {
  runApp(const StudentRoomFinder());
}

class StudentRoomFinder extends StatelessWidget {
  const StudentRoomFinder({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Where is my room',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Where is my room", style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(icon: const Icon(Icons.favorite_border), onPressed: () {})
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Find your next room", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text("PGs, hostels, rooms & roommates near your college.", style: TextStyle(fontSize: 16)),
            const SizedBox(height: 20),
            TextField(
              decoration: InputDecoration(
                hintText: "Search city, college or area",
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
            const SizedBox(height: 20),
            const Text("Accommodation", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              children: [
                ChoiceChip(label: const Text("PG"), selected: true, onSelected: (_) {}),
                ChoiceChip(label: const Text("Hostel"), selected: false, onSelected: (_) {}),
                ChoiceChip(label: const Text("Room"), selected: false, onSelected: (_) {}),
                ChoiceChip(label: const Text("Flat"), selected: false, onSelected: (_) {}),
              ],
            ),
            const SizedBox(height: 25),
            const Text("Popular student cities", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            CityCard(city: "Jaipur", subtitle: "PGs & rooms for students"),
            CityCard(city: "Delhi", subtitle: "Hostels & shared rooms"),
            CityCard(city: "Pune", subtitle: "Student accommodation"),
            CityCard(city: "Kota", subtitle: "Rooms near coaching centres"),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), label: "Home"),
          NavigationDestination(icon: Icon(Icons.search), label: "Search"),
          NavigationDestination(icon: Icon(Icons.favorite_border), label: "Saved"),
          NavigationDestination(icon: Icon(Icons.person_outline), label: "Profile"),
        ],
      ),
    );
  }
}`}

                  {selectedCodeFile === 'flutter_pubspec.yaml' && `name: student_room_finder
description: Indian student PG, hostel and room finder.
publish_to: "none"

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  shared_preferences: ^2.2.3
  image_picker: ^1.0.7
  google_maps_flutter: ^2.6.1
  geolocator: ^12.0.0

flutter:
  uses-material-design: true`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROJECT TREE */}
        {activeTab === 'project_tree' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-indigo-300">
            <pre className="text-slate-200">
{`student-room-finder/
│
├── mobile/                      # Cross-Platform Flutter Mobile Application
│   └── Flutter App
│       ├── lib/
│       │   ├── main.dart        # Material 3 setup with Indigo seed theme
│       │   ├── screens/
│       │   │   ├── login.dart
│       │   │   ├── home.dart    # Search bar, accommodation chips, popular cities
│       │   │   ├── search.dart  # Multi-filter search (city, type, rent, amenities)
│       │   │   ├── property_details.dart # Photo gallery, owner contact, reviews
│       │   │   ├── favourites.dart # Saved student shortlists
│       │   │   ├── profile.dart # Student/Owner switcher & inquiries
│       │   │   └── post_property.dart # Submit room/PG listing
│       │   ├── models/          # User, Property, Favourite, Review data classes
│       │   ├── services/        # HTTP API client to Express endpoints
│       │   └── widgets/         # CityCard, AmenityBadge, PropertyCard
│       └── pubspec.yaml
│
├── backend/                     # Node.js + Express API Microservice
│   ├── server.js                # CORS, Express JSON, Postgres connection pool
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js              # Student & Landlord authentication
│   │   ├── properties.js        # GET /api/properties & /api/properties/:id
│   │   ├── users.js
│   │   └── reviews.js           # Student ratings & feedback
│   ├── controllers/
│   ├── middleware/
│   └── database/
│
├── admin/                       # Next.js Administrator Dashboard
│   └── Next.js Admin Dashboard  # Property verification, availability, metrics
│
└── database/
    └── schema.sql               # PostgreSQL tables (users, properties, favourites, reviews)`}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
};
