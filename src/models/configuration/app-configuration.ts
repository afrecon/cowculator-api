import { ServerConfiguration } from './server-configuration' 
import { SystemConfiguration } from './system-configuration'

/**
 * Representation of the application level configuration object
 */
interface AppConfiguration {  
  server: ServerConfiguration 
  system: SystemConfiguration
}

export { AppConfiguration }
