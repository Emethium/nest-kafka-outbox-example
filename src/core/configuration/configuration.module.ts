import { ConfigModule } from '@nestjs/config';

import Configuration from './configuration';

export default ConfigModule.forRoot({
  load: [Configuration],
});
