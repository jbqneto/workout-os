export interface RestTimerState { exerciseSessionId:string; exerciseName:string; startedAt:string; endsAt:string; scheduledNotificationId?:string; }
export function createRestTimer(exerciseSessionId:string,exerciseName:string,durationSeconds:number,nowMs=Date.now()):RestTimerState{return{exerciseSessionId,exerciseName,startedAt:new Date(nowMs).toISOString(),endsAt:new Date(nowMs+durationSeconds*1000).toISOString()};}
export function remainingRestSeconds(timer:RestTimerState,nowMs=Date.now()):number{return Math.max(0,Math.ceil((Date.parse(timer.endsAt)-nowMs)/1000));}
export function extendRestTimer(timer:RestTimerState,seconds:number):RestTimerState{return{...timer,endsAt:new Date(Date.parse(timer.endsAt)+seconds*1000).toISOString()};}
