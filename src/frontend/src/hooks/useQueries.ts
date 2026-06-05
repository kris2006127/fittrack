import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Exercise,
  UserProfile,
  WorkoutGoal,
  WorkoutSession,
} from "../backend.d";
import { useActor } from "./useActor";

// ── Profile ──────────────────────────────────────────────────────────────────

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// ── Exercises ─────────────────────────────────────────────────────────────────

export function useExercises() {
  const { actor, isFetching } = useActor();
  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExercises();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Goal ──────────────────────────────────────────────────────────────────────

export function useGoal() {
  const { actor, isFetching } = useActor();
  return useQuery<WorkoutGoal | null>({
    queryKey: ["goal"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getGoal();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: WorkoutGoal) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.setGoal(goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goal"] });
    },
  });
}

// ── Workout History ───────────────────────────────────────────────────────────

export function useWorkoutHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<WorkoutSession[]>({
    queryKey: ["workoutHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkoutHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWorkoutSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session: WorkoutSession) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addWorkoutSession(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutHistory"] });
      queryClient.invalidateQueries({ queryKey: ["personalRecords"] });
    },
  });
}

// ── Personal Records ──────────────────────────────────────────────────────────

export function usePersonalRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, number]> | null>({
    queryKey: ["personalRecords"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPersonalRecords();
    },
    enabled: !!actor && !isFetching,
  });
}
