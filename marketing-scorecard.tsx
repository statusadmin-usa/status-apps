"use client"

import { useState, useEffect } from "react"
import { Plus, ChevronDown, ChevronRight, Trash2, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const DIFFICULTY_ICONS = {
  1: "⚪",
  2: "⚪⚪",
  3: "⚪⚪⚪",
}

const MARKETING_CHANNELS = [
  "Digital Advertising",
  "Digital Publishing",
  "Event Activations",
  "News, Press, Media",
  "Outbound Sales",
  "Print Advertising",
  "Referrals & Partnerships",
  "Product Experience",
  "Retail",
  "Social Media",
]

const MarketingScorecard = () => {
  // Brand Profile State
  const [brandProfile, setBrandProfile] = useState({
    totalBudget: 50000,
    personnel: [],
    products: "",
    industry: "",
    segments: "",
  })

  // Marketing Mix State
  const [marketingMix, setMarketingMix] = useState(() =>
    MARKETING_CHANNELS.reduce(
      (acc, channel) => ({
        ...acc,
        [channel]: { percentage: 0, amount: 0 },
      }),
      {},
    ),
  )

  // Validation States
  const [totalMixPercentage, setTotalMixPercentage] = useState(0)
  const [showMixWarning, setShowMixWarning] = useState(false)

  // Benchmarks State
  const [benchmarks, setBenchmarks] = useState([
    {
      id: "BM-" + Date.now(),
      timeline: "2025 Q1",
      metricName: "Increase Customer Lifetime Value",
      benchmark: 2250,
      goal: 3000,
      expanded: false,
      initiatives: [],
    },
  ])

  // Calculate total percentage for marketing mix
  useEffect(() => {
    const total = Object.values(marketingMix).reduce((sum, { percentage }) => sum + percentage, 0)
    setTotalMixPercentage(total)
    setShowMixWarning(total !== 100)
  }, [marketingMix])

  // Update channel allocation
  const updateChannelAllocation = (channel, percentage) => {
    const newPercentage = Math.min(100, Math.max(0, percentage))
    const amount = (newPercentage / 100) * brandProfile.totalBudget

    const otherChannelsTotal = Object.entries(marketingMix)
      .filter(([key]) => key !== channel)
      .reduce((sum, [_, data]) => sum + data.percentage, 0)

    if (otherChannelsTotal + newPercentage <= 100) {
      setMarketingMix({
        ...marketingMix,
        [channel]: { percentage: newPercentage, amount },
      })
    }
  }

  // Benchmark functions
  const toggleBenchmark = (id) => {
    setBenchmarks(benchmarks.map((b) => (b.id === id ? { ...b, expanded: !b.expanded } : b)))
  }

  const deleteBenchmark = (id) => {
    setBenchmarks(benchmarks.filter((b) => b.id !== id))
  }

  const addBenchmark = () => {
    setBenchmarks([
      ...benchmarks,
      {
        id: "BM-" + Date.now(),
        timeline: "",
        metricName: "",
        benchmark: 0,
        goal: 0,
        expanded: false,
        initiatives: [],
      },
    ])
  }

  // Initiative functions
  const addInitiative = (benchmarkId) => {
    setBenchmarks(
      benchmarks.map((b) =>
        b.id === benchmarkId
          ? {
              ...b,
              initiatives: [
                ...b.initiatives,
                {
                  id: "IN-" + Date.now(),
                  name: "",
                  cost: 0,
                  budgetPercent: 0,
                  difficulty: 1,
                  personnel: [],
                  status: "PENDING",
                },
              ],
            }
          : b,
      ),
    )
  }

  const updateInitiative = (benchmarkId, initiativeId, field, value) => {
    setBenchmarks(
      benchmarks.map((b) =>
        b.id === benchmarkId
          ? {
              ...b,
              initiatives: b.initiatives.map((i) => (i.id === initiativeId ? { ...i, [field]: value } : i)),
            }
          : b,
      ),
    )
  }

  const togglePersonnel = (benchmarkId, initiativeId, personnelId) => {
    setBenchmarks(
      benchmarks.map((b) =>
        b.id === benchmarkId
          ? {
              ...b,
              initiatives: b.initiatives.map((i) =>
                i.id === initiativeId
                  ? {
                      ...i,
                      personnel: i.personnel.includes(personnelId)
                        ? i.personnel.filter((id) => id !== personnelId)
                        : [...i.personnel, personnelId],
                    }
                  : i,
              ),
            }
          : b,
      ),
    )
  }

  // Prepare data for pie chart
  const pieChartData = Object.entries(marketingMix)
    .filter(([_, data]) => data.percentage > 0)
    .map(([channel, data]) => ({
      name: channel,
      value: data.percentage,
    }))

  const COLORS = ["#84cc16", "#65a30d", "#4d7c0f", "#3f6212"]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketing Scorecard</h1>

      {/* Brand Profile */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalBudget">Total Budget</Label>
              <Input
                id="totalBudget"
                type="number"
                value={brandProfile.totalBudget}
                onChange={(e) => setBrandProfile({ ...brandProfile, totalBudget: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="products">Products</Label>
              <Input
                id="products"
                value={brandProfile.products}
                onChange={(e) => setBrandProfile({ ...brandProfile, products: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={brandProfile.industry}
                onChange={(e) => setBrandProfile({ ...brandProfile, industry: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="segments">Segments</Label>
              <Input
                id="segments"
                value={brandProfile.segments}
                onChange={(e) => setBrandProfile({ ...brandProfile, segments: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Mix */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Marketing Mix</CardTitle>
        </CardHeader>
        <CardContent>
          {showMixWarning && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Total allocation must equal 100%. Current total: {totalMixPercentage}%
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            {MARKETING_CHANNELS.map((channel) => (
              <div key={channel}>
                <Label htmlFor={channel}>{channel}</Label>
                <Input
                  id={channel}
                  type="number"
                  value={marketingMix[channel].percentage}
                  onChange={(e) => updateChannelAllocation(channel, Number(e.target.value))}
                />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          {benchmarks.map((benchmark) => (
            <div key={benchmark.id} className="mb-4 border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{benchmark.metricName}</h3>
                <div>
                  <Button variant="ghost" size="sm" onClick={() => toggleBenchmark(benchmark.id)}>
                    {benchmark.expanded ? <ChevronDown /> : <ChevronRight />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteBenchmark(benchmark.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
              {benchmark.expanded && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`timeline-${benchmark.id}`}>Timeline</Label>
                      <Input
                        id={`timeline-${benchmark.id}`}
                        value={benchmark.timeline}
                        onChange={(e) => updateInitiative(benchmark.id, null, "timeline", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`benchmark-${benchmark.id}`}>Benchmark</Label>
                      <Input
                        id={`benchmark-${benchmark.id}`}
                        type="number"
                        value={benchmark.benchmark}
                        onChange={(e) => updateInitiative(benchmark.id, null, "benchmark", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`goal-${benchmark.id}`}>Goal</Label>
                      <Input
                        id={`goal-${benchmark.id}`}
                        type="number"
                        value={benchmark.goal}
                        onChange={(e) => updateInitiative(benchmark.id, null, "goal", Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">Initiatives</h4>
                  {benchmark.initiatives.map((initiative) => (
                    <div key={initiative.id} className="mb-2 p-2 border rounded">
                      <Input
                        placeholder="Initiative name"
                        value={initiative.name}
                        onChange={(e) => updateInitiative(benchmark.id, initiative.id, "name", e.target.value)}
                        className="mb-2"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="number"
                          placeholder="Cost"
                          value={initiative.cost}
                          onChange={(e) =>
                            updateInitiative(benchmark.id, initiative.id, "cost", Number(e.target.value))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Budget %"
                          value={initiative.budgetPercent}
                          onChange={(e) =>
                            updateInitiative(benchmark.id, initiative.id, "budgetPercent", Number(e.target.value))
                          }
                        />
                        <select
                          value={initiative.difficulty}
                          onChange={(e) =>
                            updateInitiative(benchmark.id, initiative.id, "difficulty", Number(e.target.value))
                          }
                          className="border rounded p-2"
                        >
                          {Object.entries(DIFFICULTY_ICONS).map(([value, icon]) => (
                            <option key={value} value={value}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => addInitiative(benchmark.id)} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Initiative
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button onClick={addBenchmark}>
            <Plus className="mr-2 h-4 w-4" /> Add Benchmark
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default MarketingScorecard

