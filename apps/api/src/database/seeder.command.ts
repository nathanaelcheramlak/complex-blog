import { Command, CommandRunner } from 'nest-commander';
import { SeederService } from 'src/database/seeder.service';

@Command({ name: 'seed', description: 'seed the database' })
export class SeederCommander extends CommandRunner {
  constructor(private readonly seederService: SeederService) {
    super();
  }

  async run(): Promise<void> {
    await this.seederService.seed();
    process.exit(0);
  }
}
