import m0000 from './0000_bumpy_darkhawk.sql'
import m0001 from './0001_nifty_cable.sql'
import m0002 from './0002_uppercase_sorting.sql'
import journal from './meta/_journal.json'

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
  },
}
