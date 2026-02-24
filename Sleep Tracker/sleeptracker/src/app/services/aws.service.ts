import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { SleepService } from './sleep.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
  private readonly tableName = 'sleep-tracker-data';
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  
  constructor(private sleepService: SleepService) {
    this.client = new DynamoDBClient({ region: 'us-east-1' });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  async backupToCloud(): Promise<{ success: boolean; message: string }> {
    try {
      const allData = SleepService.AllSleepData;
      
      console.log('Backing up data to AWS:', allData.length, 'entries');
      
      // Upload each item to DynamoDB
      for (const item of allData) {
        await this.docClient.send(new PutCommand({
          TableName: this.tableName,
          Item: {
            id: item.id,
            loggedAt: item.loggedAt.toISOString(),
            type: item.constructor.name,
            data: JSON.stringify(item)
          }
        }));
      }
      
      console.log('AWS backup completed successfully');
      
      return {
        success: true,
        message: `Successfully backed up ${allData.length} entries to cloud`
      };
    } catch (error) {
      console.error('AWS backup failed:', error);
      return {
        success: false,
        message: 'Failed to backup data to cloud. Please check AWS credentials.'
      };
    }
  }

  async restoreFromCloud(): Promise<{ success: boolean; message: string; dataCount?: number }> {
    try {
      console.log('Restoring data from AWS...');
      
      // Scan all items from DynamoDB
      const result = await this.docClient.send(new ScanCommand({
        TableName: this.tableName
      }));
      
      console.log('AWS restore completed successfully');
      console.log('Found items:', result.Items?.length || 0);
      
      return {
        success: true,
        message: 'Successfully restored data from cloud',
        dataCount: result.Items?.length || 0
      };
    } catch (error) {
      console.error('AWS restore failed:', error);
      return {
        success: false,
        message: 'Failed to restore data from cloud. Please check AWS credentials.'
      };
    }
  }
}
