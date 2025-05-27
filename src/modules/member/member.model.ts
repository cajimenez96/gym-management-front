export type MemberStatus = 'Active' | 'Inactive' | 'Suspended';
export type MembershipStatus = 'active' | 'expired';
// Se elimina o comenta el antiguo tipo MembershipPlan, ya que los planes ahora son entidades separadas
// export type MembershipPlan = 'monthly' | 'custom'; 

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
  email?: string;
  phone?: string;
  startDate: string;
  renewalDate: string;
  membershipStatus: MembershipStatus;
  membershipPlanId?: string | null; // Cambiado de membershipPlan: MembershipPlan
  // Opcionalmente, si el backend devuelve el objeto plan completo:
  // membershipPlan?: { id: string; name: string; duration: string; price: number } | null;
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
}

// CreateMemberData debe incluir todos los campos necesarios para la creación, incluyendo el ID del plan
export type CreateMemberData = Omit<
  Member,
  'id' | 'createdAt' | 'updatedAt' | 'status' // status podría ser calculado o default
>; // membershipPlanId ya es opcional en Member, así que está bien aquí

export type UpdateMemberData = Partial<Omit<CreateMemberData, 'dni'>> & {
  dni?: string; // DNI no suele ser parte del Partial principal para update, se maneja con cuidado
  status?: MemberStatus;
  membershipPlanId?: string | null; // Asegurar que se pueda actualizar
};

export interface SearchMemberByDniData {
  dni: string;
}

export interface RenewMembershipData {
  dni: string;
  renewalDate?: string;
  membershipPlanId?: string | null; // Cambiado de membershipPlan?: MembershipPlan
}

export interface MemberCheckInInfoDto {
  id: string;
  firstName: string;
  lastName: string;
  startDate: string; // Fecha de ingreso, formateada por el backend
  renewalDate: string; // Próximo vencimiento, formateada por el backend
  planName: string | null; // Nombre del plan
  membershipStatusText: string; // "Habilitado" o "No Habilitado"
}
