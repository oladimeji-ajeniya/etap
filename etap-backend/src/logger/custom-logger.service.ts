import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class CustomLogger implements LoggerService {
    
  private logToFile(message: string): void {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile('application.log', logMessage, (err) => {
      if (err) throw err;
    });
  }

  log(message: string) {
    console.log(message);
    this.logToFile(`LOG: ${message}`);
  }

  error(message: string, trace?: string) {
    console.error(message);
    this.logToFile(`ERROR: ${message} ${trace ? `- Trace: ${trace}` : ''}`);
  }

  warn(message: string) {
    console.warn(message);
    this.logToFile(`WARN: ${message}`);
  }

  debug(message: string) {
    console.debug(message);
    this.logToFile(`DEBUG: ${message}`);
  }

  verbose(message: string) {
    console.log(message);
    this.logToFile(`VERBOSE: ${message}`);
  }
}
