import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { TrainerResponseSchema, type TrainerResponse } from './schemas';
export interface ParsedTrainerResponse{value:TrainerResponse;sourceName:string;}
export async function pickAndParseTrainerResponse():Promise<ParsedTrainerResponse|null>{const result=await DocumentPicker.getDocumentAsync({type:'application/json',copyToCacheDirectory:true,multiple:false});if(result.canceled)return null;const asset=result.assets[0];if(!asset)return null;const file=new File(asset.uri);const raw=await file.text();const json:unknown=JSON.parse(raw);return{value:TrainerResponseSchema.parse(json),sourceName:asset.name};}
