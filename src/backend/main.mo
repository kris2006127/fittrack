import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type MuscleGroup = {
    #chest;
    #legs;
    #back;
    #cardio;
    #shoulders;
    #arms;
    #core;
  };

  type Exercise = {
    name : Text;
    muscleGroup : MuscleGroup;
  };

  type WorkoutSession = {
    timestamp : Time.Time;
    exercises : [ExerciseLog];
  };

  type ExerciseLog = {
    exercise : Exercise;
    sets : Nat;
    reps : Nat;
    weightKg : Float;
    durationMin : Float;
  };

  type WorkoutGoal = {
    weeklyFrequency : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let workoutSessions = Map.empty<Principal, List.List<WorkoutSession>>();
  let personalRecords = Map.empty<Principal, Map.Map<Text, Float>>();
  let workoutGoals = Map.empty<Principal, WorkoutGoal>();

  func initialExerciseList() : [Exercise] {
    [
      { name = "Bench Press"; muscleGroup = #chest },
      { name = "Squat"; muscleGroup = #legs },
      { name = "Deadlift"; muscleGroup = #back },
      { name = "Pull-up"; muscleGroup = #back },
      { name = "Push-up"; muscleGroup = #chest },
      { name = "Running"; muscleGroup = #cardio },
      { name = "Cycling"; muscleGroup = #cardio },
      { name = "Shoulder Press"; muscleGroup = #shoulders },
      { name = "Bicep Curl"; muscleGroup = #arms },
      { name = "Tricep Dip"; muscleGroup = #arms },
      { name = "Lunges"; muscleGroup = #legs },
      { name = "Plank"; muscleGroup = #core },
      { name = "Sit-up"; muscleGroup = #core },
      { name = "Row"; muscleGroup = #back },
      { name = "Lat Pulldown"; muscleGroup = #back },
    ];
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getExercises() : async [Exercise] {
    initialExerciseList();
  };

  public query ({ caller }) func getGoal() : async ?WorkoutGoal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get goals");
    };
    workoutGoals.get(caller);
  };

  public shared ({ caller }) func setGoal(goal : WorkoutGoal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set goals");
    };
    workoutGoals.add(caller, goal);
  };

  public query ({ caller }) func getPersonalRecords() : async ?[(Text, Float)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get personal records");
    };
    switch (personalRecords.get(caller)) {
      case (null) { null };
      case (?records) { ?records.toArray() };
    };
  };

  func updatePersonalRecords(caller : Principal, exercises : [ExerciseLog]) {
    let currentRecords = switch (personalRecords.get(caller)) {
      case (?records) { records };
      case (null) { Map.empty<Text, Float>() };
    };

    for (exercise in exercises.values()) {
      let currentMax = switch (currentRecords.get(exercise.exercise.name)) {
        case (?max) { max };
        case (null) { 0.0 };
      };
      if (exercise.weightKg > currentMax) {
        currentRecords.add(exercise.exercise.name, exercise.weightKg);
      };
    };

    personalRecords.add(caller, currentRecords);
  };

  public shared ({ caller }) func addWorkoutSession(session : WorkoutSession) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add workout sessions");
    };

    let existingSessions = switch (workoutSessions.get(caller)) {
      case (?sessions) { sessions };
      case (null) { List.empty<WorkoutSession>() };
    };

    existingSessions.add(session);

    let validSessions = existingSessions.filter(
      func(s : WorkoutSession) : Bool { s.exercises.size() > 0 }
    );

    workoutSessions.add(caller, validSessions);
    updatePersonalRecords(caller, session.exercises);
  };

  public query ({ caller }) func getWorkoutHistory() : async [WorkoutSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get workout history");
    };
    switch (workoutSessions.get(caller)) {
      case (?sessions) {
        let sessionsArray = sessions.toArray();
        sessionsArray.sort(func(a : WorkoutSession, b : WorkoutSession) : Order.Order {
          Int.compare(b.timestamp, a.timestamp)
        });
      };
      case (null) { [] };
    };
  };
};
