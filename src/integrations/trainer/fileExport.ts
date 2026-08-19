import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
export async function exportJsonFile(filename:string,value:unknown):Promise<string>{const file=new File(Paths.cache,filename);if(file.exists)file.delete();file.create();file.write(JSON.stringify(value,null,2));if(await Sharing.isAvailableAsync()){await Sharing.shareAsync(file.uri,{mimeType:'application/json',dialogTitle:filename});}return file.uri;}
