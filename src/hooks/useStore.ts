import { useContext } from "react"
import { MobXProviderContext } from "mobx-react"
import type RootStore from "../Stores/RootStore"


export const useStore = (): typeof RootStore => {
    return useContext(MobXProviderContext) as typeof RootStore
  }
  

