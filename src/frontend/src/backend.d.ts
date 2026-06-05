import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    name: string;
    muscleGroup: MuscleGroup;
}
export type Time = bigint;
export interface WorkoutSession {
    exercises: Array<ExerciseLog>;
    timestamp: Time;
}
export interface WorkoutGoal {
    weeklyFrequency: bigint;
}
export interface ExerciseLog {
    reps: bigint;
    sets: bigint;
    exercise: Exercise;
    weightKg: number;
    durationMin: number;
}
export interface UserProfile {
    name: string;
}
export enum MuscleGroup {
    shoulders = "shoulders",
    arms = "arms",
    back = "back",
    core = "core",
    chest = "chest",
    legs = "legs",
    cardio = "cardio"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addWorkoutSession(session: WorkoutSession): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExercises(): Promise<Array<Exercise>>;
    getGoal(): Promise<WorkoutGoal | null>;
    getPersonalRecords(): Promise<Array<[string, number]> | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkoutHistory(): Promise<Array<WorkoutSession>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setGoal(goal: WorkoutGoal): Promise<void>;
}
