import type { SoupFormData } from '../../types/PuzzleTypes';
type __VLS_Props = {
    initialData?: SoupFormData;
    statusOptions?: Array<{
        code: string;
        value: string;
        description: string;
    }>;
    statusLoading?: boolean;
    tagOptions?: Array<{
        code: string;
        value: string;
        description: string;
    }>;
    tagLoading?: boolean;
    isCreateMode?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    submit: (...args: any[]) => void;
    cancel: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSubmit?: ((...args: any[]) => any) | undefined;
    onCancel?: ((...args: any[]) => any) | undefined;
}>, {
    statusOptions: Array<{
        code: string;
        value: string;
        description: string;
    }>;
    statusLoading: boolean;
    tagOptions: Array<{
        code: string;
        value: string;
        description: string;
    }>;
    tagLoading: boolean;
    isCreateMode: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
