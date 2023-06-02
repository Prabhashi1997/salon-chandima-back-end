import 'source-map-support/register';
import { app } from './app';
import Configs from './common/Configs';
Configs.load();


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

