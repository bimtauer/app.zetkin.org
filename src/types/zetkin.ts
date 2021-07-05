export interface ZetkinCampaign {
    color: string;
    info_text: string;
    title: string;
    id: number;
    organization?: ZetkinOrganization;
    manager: string | null;
}

export interface ZetkinMembership {
    organization: ZetkinOrganization;
    follow?: boolean;
    profile: {
        id: number;
        name: string;
    };
    inherited?: false;
    role : string | null;
}

export interface ZetkinEventResponse {
    action_id: number;
    id: number;
    person: {
        id: number;
        name: string;
    };
    response_date: string;
}

export interface ZetkinEvent {
    activity: { title: string };
    campaign: {
        id: number;
        title: string;
    };
    contact?: string | null;
    end_time: string;
    id: number;
    info_text: string;
    location: {
        id: number;
        lat: number;
        lng: number;
        title: string;
    };
    num_participants_required?: number;
    num_participants_available?: number;
    start_time: string;
    title?: string;
    organization: {
        id: number;
        title: string;
    };
    userBooked?: boolean;
    userResponse?: boolean;
}

export interface ZetkinUser {
    first_name: string;
    id: number;
    last_name: string;
    username: string;
}

export interface ZetkinOrganization {
    id: number;
    title: string;
}

export interface ZetkinPerson {
    alt_phone: string;
    is_user: boolean;
    zip_code: string; // Need to check
    last_name: string;
    city: null; // Need to check
    first_name: string;
    gender: 'm'; // Check gender options
    street_address: null; // Need to check
    co_address: null; // Need to check
    ext_id: null; // Str or num
    email: string;
    country: null; // Check
    id: number;
    phone: string;
}

export interface ZetkinSession {
    created: string;
    level: number;
    user: ZetkinUser;
}

export interface ZetkinCallAssignment {
    cooldown: number;
    description: string;
    disable_caller_notes: boolean;
    end_date: string;
    goal: {
        filter_spec: undefined;
        id: number;
        type: string;
    };
    id: number;
    instructions: string;
    organization: {
        id: number;
        title: string;
    };
    organization_id: number;
    start_date: string;
    target: {
        filter_spec: [
            {
                config: {
                    after: string;
                    campaign: number;
                    operator: string;
                };
                type: string;
            }
        ];
        id: number;
        type: string;
    };
    title: string;
}
