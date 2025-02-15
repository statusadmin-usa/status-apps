"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ChevronDown, ChevronRight, Trash2, Info, Sparkles } from "lucide-react"
import { TOOLTIPS } from "./tooltips"

interface Initiative {
  id: string
  name: string
  cost: number
  budgetPercent: number
  difficulty: 1 | 2 | 3
  personnel: string[]
  status: "PENDING" | "APPROVED" | "REJECTED"
}

interface Benchmark {
  id: string
  title: string
  timeline: string
  metricName: string
  benchmark: string
  goal: string
  expanded: boolean
  initiatives: Initiative[]
  notes: string
}

interface BenchmarksProps {
  totalBudget: number
  personnel: string[]
}

export default function Benchmarks({ totalBudget, personnel }: BenchmarksProps) {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([
    {
      id: "BM-" + Date.now(),
      title: "New Benchmark",
      timeline: "2025 Q1",
      metricName: "",
      benchmark: "",
      goal: "",
      expanded: false,
      initiatives: [],
      notes: "",
    },
  ])

  const toggleBenchmark = (id: string) => {
    setBenchmarks((prev) => prev.map((b) => (b.id === id ? { ...b, expanded: !b.expanded } : b)))
  }

  const addInitiative = (benchmarkId: string) => {
    setBenchmarks((prev) =>
      prev.map((b) =>
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

  const updateInitiative = (benchmarkId: string, initiativeId: string, field: string, value: any) => {
    setBenchmarks((prev) =>
      prev.map((b) =>
        b.id === benchmarkId
          ? {
              ...b,
              initiatives: b.initiatives.map((i) =>
                i.id === initiativeId
                  ? {
                      ...i,
                      [field]: value,
                      budgetPercent: field === "cost" ? (value / totalBudget) * 100 : i.budgetPercent,
                    }
                  : i,
              ),
            }
          : b,
      ),
    )
  }

  const addBenchmark = () => {
    setBenchmarks((prev) => [
      ...prev,
      {
        id: "BM-" + Date.now(),
        title: "New Benchmark",
        timeline: "",
        metricName: "",
        benchmark: "",
        goal: "",
        expanded: true,
        initiatives: [],
        notes: "",
      },
    ])
  }

  const deleteBenchmark = (id: string) => {
    setBenchmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const deleteInitiative = (benchmarkId: string, initiativeId: string) => {
    setBenchmarks((prev) =>
      prev.map((b) =>
        b.id === benchmarkId ? { ...b, initiatives: b.initiatives.filter((i) => i.id !== initiativeId) } : b,
      ),
    )
  }

  const updateBenchmark = (id: string, field: string, value: string) => {
    setBenchmarks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const generateInitiatives = (benchmarkId: string) => {
    const benchmark = benchmarks.find((b) => b.id === benchmarkId)
    if (!benchmark) return

    const sampleInitiatives = [
      {
        name: `Increase ${benchmark.metricName} through targeted campaigns`,
        cost: Math.round(totalBudget * 0.2),
        difficulty: 2,
        personnel: personnel.slice(0, 2),
        status: "PENDING",
      },
      {
        name: `Optimize ${benchmark.metricName} with data-driven strategies`,
        cost: Math.round(totalBudget * 0.15),
        difficulty: 3,
        personnel: personnel.slice(1, 3),
        status: "PENDING",
      },
      {
        name: `Enhance ${benchmark.metricName} via customer feedback implementation`,
        cost: Math.round(totalBudget * 0.1),
        difficulty: 1,
        personnel: personnel.slice(2, 4),
        status: "PENDING",
      },
    ]

    setBenchmarks((prev) =>
      prev.map((b) =>
        b.id === benchmarkId
          ? {
              ...b,
              initiatives: sampleInitiatives.map((initiative) => ({
                id: "IN-" + Date.now() + Math.random(),
                ...initiative,
                budgetPercent: (initiative.cost / totalBudget) * 100,
              })),
            }
          : b,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Benchmarks & Goals</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>{TOOLTIPS.benchmarks.title}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {benchmarks.map((benchmark) => (
            <div key={benchmark.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm" onClick={() => toggleBenchmark(benchmark.id)}>
                  {benchmark.expanded ? <ChevronDown /> : <ChevronRight />}
                </Button>
                <Input
                  value={benchmark.title}
                  onChange={(e) => updateBenchmark(benchmark.id, "title", e.target.value)}
                  placeholder="Title of Goal"
                  className="text-lg font-semibold w-auto"
                />
                <Button variant="ghost" size="sm" onClick={() => deleteBenchmark(benchmark.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                value={benchmark.notes}
                onChange={(e) => updateBenchmark(benchmark.id, "notes", e.target.value)}
                placeholder="Add notes here..."
                className="mt-2 h-24 resize-none"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">
                    Expand Notes
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Notes for {benchmark.title}</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={benchmark.notes}
                    onChange={(e) => updateBenchmark(benchmark.id, "notes", e.target.value)}
                    className="min-h-[200px]"
                  />
                </DialogContent>
              </Dialog>

              {benchmark.expanded && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Timeline</label>
                      <Input
                        value={benchmark.timeline}
                        onChange={(e) => updateBenchmark(benchmark.id, "timeline", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Metric Name</label>
                      <Input
                        value={benchmark.metricName}
                        onChange={(e) => updateBenchmark(benchmark.id, "metricName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Benchmark</label>
                      <Input
                        value={benchmark.benchmark}
                        onChange={(e) => updateBenchmark(benchmark.id, "benchmark", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Goal</label>
                      <Input
                        value={benchmark.goal}
                        onChange={(e) => updateBenchmark(benchmark.id, "goal", e.target.value)}
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-semibold mb-2">Initiatives</h4>
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Budget %</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Personnel</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {benchmark.initiatives.map((initiative) => (
                          <TableRow key={initiative.id}>
                            <TableCell>
                              <Input
                                value={initiative.name}
                                onChange={(e) => updateInitiative(benchmark.id, initiative.id, "name", e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={initiative.cost}
                                onChange={(e) =>
                                  updateInitiative(benchmark.id, initiative.id, "cost", Number(e.target.value))
                                }
                              />
                            </TableCell>
                            <TableCell>{initiative.budgetPercent.toFixed(2)}%</TableCell>
                            <TableCell>
                              <Select
                                value={String(initiative.difficulty)}
                                onValueChange={(value) =>
                                  updateInitiative(benchmark.id, initiative.id, "difficulty", Number(value))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">⚪ Easy</SelectItem>
                                  <SelectItem value="2">⚪⚪ Medium</SelectItem>
                                  <SelectItem value="3">⚪⚪⚪ Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={initiative.personnel.join(",")}
                                onValueChange={(value) =>
                                  updateInitiative(benchmark.id, initiative.id, "personnel", value.split(","))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select team members" />
                                </SelectTrigger>
                                <SelectContent>
                                  {personnel.map((person) => (
                                    <SelectItem key={person} value={person}>
                                      {person}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={initiative.status}
                                onValueChange={(value) =>
                                  updateInitiative(benchmark.id, initiative.id, "status", value)
                                }
                              >
                                <SelectTrigger className={getStatusColor(initiative.status)}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PENDING">Pending</SelectItem>
                                  <SelectItem value="APPROVED">Approved</SelectItem>
                                  <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteInitiative(benchmark.id, initiative.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button onClick={() => addInitiative(benchmark.id)} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Initiative
                  </Button>
                  <Button onClick={() => generateInitiatives(benchmark.id)} className="mt-2 ml-2">
                    <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button onClick={addBenchmark} className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add Benchmark
        </Button>
      </CardContent>
    </Card>
  )
}

