import { createSlice } from "@reduxjs/toolkit"



const initialState = {
  data: null,
  isEditing: {
    generalInfo: false,
    billingAddress: false,
    salesPoints: false,
    documents: false,
  },
}

const dealerSlice = createSlice({
  name: "dealer",
  initialState,
  reducers: {
    setDealerData: (state, action) => {
      state.data = action.payload
    },
    toggleEditing: (state, action) => {
      state.isEditing[action.payload] = !state.isEditing[action.payload]
    },
    updateDealerData: (state, action) => {
      state.data[action.payload.section] = action.payload.data
    },
  },
})

export const { setDealerData, toggleEditing, updateDealerData } = dealerSlice.actions
export default dealerSlice.reducer

