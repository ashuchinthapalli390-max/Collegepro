import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Department, ETDepartmentCode } from '../types/nec'
import { CANONICAL_ET_DEPARTMENTS, DepartmentResolver } from '../utils/departmentResolver'

interface DepartmentState {
  departments: Department[]
  updateDepartmentName: (id: string, officialName: string, shortName: string) => void
  getDepartment: (idOrCode: string) => Department
  getDisplayName: (idOrCode: string) => string
}

export const useDepartmentStore = create<DepartmentState>()(
  persist(
    (set, get) => ({
      departments: CANONICAL_ET_DEPARTMENTS,

      updateDepartmentName: (id: string, officialName: string, shortName: string) => {
        set((state) => ({
          departments: state.departments.map((d) =>
            d.id === id ? { ...d, officialName, shortName } : d
          )
        }))
      },

      getDepartment: (idOrCode: string) => {
        const found = get().departments.find(
          (d) => d.id.toLowerCase() === idOrCode.toLowerCase() || d.code.toLowerCase() === idOrCode.toLowerCase()
        )
        if (found) return found
        return DepartmentResolver.getDepartmentById(idOrCode)
      },

      getDisplayName: (idOrCode: string) => {
        const dept = get().getDepartment(idOrCode)
        return dept ? dept.officialName : idOrCode
      }
    }),
    {
      name: 'nec_department_master_v4'
    }
  )
)
