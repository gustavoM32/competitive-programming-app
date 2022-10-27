export type ProblemId = {
  contestId: number,
  index: string
}

export type Problem = any;

export type ProblemType = any; // TODO: use better definition

export type ProblemListType = any; // TODO: use better definition

export type CfProblem = {
  problemId: ProblemId,
  name: string,
  rating: number
}

export type CfContest = {
  id: number,
  name: string,
  startTime: string,
  durationSeconds: number
}

export type UserProblemStatus = {
  problemId: ProblemId,
  user: string,
  problemStatus: string,
  contestStatus: string
}

export type UserContestStatus = {
  id: number,
  user: string,
  contestStatus: string
}