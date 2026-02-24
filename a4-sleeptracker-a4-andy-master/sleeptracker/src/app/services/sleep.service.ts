import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];
	private storage: Storage | null = null;
	private readonly STORAGE_KEY_OVERNIGHT = 'overnight_sleep_data';
	private readonly STORAGE_KEY_SLEEPINESS = 'sleepiness_data';

	constructor(private storageService: Storage) {
		this.initStorage();
	}

	async initStorage() {
		// Create storage instance
		this.storage = await this.storageService.create();
		
		// Load data from storage
		await this.loadDataFromStorage();
		
		// Only add default data if no data was loaded from storage
		if(SleepService.LoadDefaultData && SleepService.AllSleepData.length === 0) {
			this.addDefaultData();
			SleepService.LoadDefaultData = false;
		}
	}

	private async loadDataFromStorage() {
		if (!this.storage) return;

		try {
			// Load overnight sleep data
			const overnightDataJson = await this.storage.get(this.STORAGE_KEY_OVERNIGHT);
			if (overnightDataJson && Array.isArray(overnightDataJson)) {
				const overnightData = overnightDataJson.map((item: any) => {
					const sleepStart = new Date(item.sleepStart);
					const sleepEnd = new Date(item.sleepEnd);
					const data = new OvernightSleepData(sleepStart, sleepEnd);
					data.id = item.id;
					data.loggedAt = new Date(item.loggedAt);
					return data;
				});
				SleepService.AllOvernightData = overnightData;
				SleepService.AllSleepData.push(...overnightData);
			}

			// Load sleepiness data
			const sleepinessDataJson = await this.storage.get(this.STORAGE_KEY_SLEEPINESS);
			if (sleepinessDataJson && Array.isArray(sleepinessDataJson)) {
				const sleepinessData = sleepinessDataJson.map((item: any) => {
					const loggedAt = new Date(item.loggedAt);
					const data = new StanfordSleepinessData(item.loggedValue, loggedAt);
					data.id = item.id;
					return data;
				});
				SleepService.AllSleepinessData = sleepinessData;
				SleepService.AllSleepData.push(...sleepinessData);
			}

			console.log('Data loaded from storage:', {
				overnight: SleepService.AllOvernightData.length,
				sleepiness: SleepService.AllSleepinessData.length,
				total: SleepService.AllSleepData.length
			});
		} catch (error) {
			console.error('Error loading data from storage:', error);
		}
	}

	private async saveOvernightDataToStorage() {
		if (!this.storage) return;

		try {
			const dataToSave = SleepService.AllOvernightData.map(data => ({
				id: data.id,
				loggedAt: data.loggedAt.toISOString(),
				sleepStart: (data as any).sleepStart.toISOString(),
				sleepEnd: (data as any).sleepEnd.toISOString()
			}));
			await this.storage.set(this.STORAGE_KEY_OVERNIGHT, dataToSave);
			console.log('Overnight data saved to storage:', dataToSave.length);
		} catch (error) {
			console.error('Error saving overnight data to storage:', error);
		}
	}

	private async saveSleepinessDataToStorage() {
		if (!this.storage) return;

		try {
			const dataToSave = SleepService.AllSleepinessData.map(data => ({
				id: data.id,
				loggedAt: data.loggedAt.toISOString(),
				loggedValue: parseInt(data.summaryString().split(':')[0])
			}));
			await this.storage.set(this.STORAGE_KEY_SLEEPINESS, dataToSave);
			console.log('Sleepiness data saved to storage:', dataToSave.length);
		} catch (error) {
			console.error('Error saving sleepiness data to storage:', error);
		}
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		this.saveOvernightDataToStorage();
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		this.saveSleepinessDataToStorage();
	}

	public deleteSleepData(dataId: string) {
		// Remove from AllSleepData array
		SleepService.AllSleepData = SleepService.AllSleepData.filter(data => data.id !== dataId);
		
		// Remove from specific arrays
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(data => data.id !== dataId);
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(data => data.id !== dataId);
		
		// Save changes to storage
		this.saveOvernightDataToStorage();
		this.saveSleepinessDataToStorage();
		
		console.log('Data deleted:', dataId);
	}

	public updateSleepData(updatedData: SleepData) {
		// Find and update the data in AllSleepData
		const index = SleepService.AllSleepData.findIndex(data => data.id === updatedData.id);
		if (index !== -1) {
			SleepService.AllSleepData[index] = updatedData;
		}
		
		// Update in specific arrays
		if (updatedData instanceof OvernightSleepData) {
			const overnightIndex = SleepService.AllOvernightData.findIndex(data => data.id === updatedData.id);
			if (overnightIndex !== -1) {
				SleepService.AllOvernightData[overnightIndex] = updatedData;
			}
			this.saveOvernightDataToStorage();
		} else if (updatedData instanceof StanfordSleepinessData) {
			const sleepinessIndex = SleepService.AllSleepinessData.findIndex(data => data.id === updatedData.id);
			if (sleepinessIndex !== -1) {
				SleepService.AllSleepinessData[sleepinessIndex] = updatedData;
			}
			this.saveSleepinessDataToStorage();
		}
		
		console.log('Data updated:', updatedData.id);
	}
}
