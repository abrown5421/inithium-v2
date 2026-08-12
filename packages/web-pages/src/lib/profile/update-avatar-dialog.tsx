import React from 'react';
import {
  Button,
  ColorPicker,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FileDropzone,
  Label,
  SelectField,
  SelectFieldOption,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  UserAvatar
} from '@inithium/ui';
import {
  DEFAULT_CUSTOM_AVATAR_CONFIG,
  type AvatarFont,
  type AvatarShape,
  type AvatarType,
  type ProfileAvatar
} from '@inithium/models';
import { updateProfileSchema } from '@inithium/validators';
import {
  openAlert,
  resolveAvatarDisplay,
  useAppDispatch,
  useCreateProfileMutation,
  useDeleteProfileAvatarImageMutation,
  useUpdateProfileMutation,
  useUploadProfileAvatarImageMutation
} from '@inithium/store';

const VALIDATION_ERROR_MESSAGE = 'There were errors in your form';

const AVATAR_FONT_OPTIONS: readonly SelectFieldOption[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'sans', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Mono' }
];

const AVATAR_SHAPE_OPTIONS: readonly SelectFieldOption[] = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' }
];

export interface UpdateAvatarDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly userId: string;
  readonly profileId?: string;
  readonly avatar?: ProfileAvatar;
}

const parseAssetKey = (assetRef: string): string => assetRef.split('/').filter(Boolean).pop() ?? assetRef;

export const UpdateAvatarDialog: React.FC<UpdateAvatarDialogProps> = ({
  open,
  onOpenChange,
  userId,
  profileId,
  avatar
}) => {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = React.useState<AvatarType>(avatar?.avatarType ?? 'custom');
  const [backgroundColor, setBackgroundColor] = React.useState(
    avatar?.customAvatarConfig?.backgroundColor ?? DEFAULT_CUSTOM_AVATAR_CONFIG.backgroundColor
  );
  const [fontColor, setFontColor] = React.useState(
    avatar?.customAvatarConfig?.fontColor ?? DEFAULT_CUSTOM_AVATAR_CONFIG.fontColor
  );
  const [font, setFont] = React.useState<AvatarFont>(
    avatar?.customAvatarConfig?.font ?? DEFAULT_CUSTOM_AVATAR_CONFIG.font
  );
  const [shape, setShape] = React.useState<AvatarShape>(
    avatar?.customAvatarConfig?.shape ?? DEFAULT_CUSTOM_AVATAR_CONFIG.shape
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | undefined>();

  const previousImageRefRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (!open) return;
    setActiveTab(avatar?.avatarType ?? 'custom');
    setBackgroundColor(avatar?.customAvatarConfig?.backgroundColor ?? DEFAULT_CUSTOM_AVATAR_CONFIG.backgroundColor);
    setFontColor(avatar?.customAvatarConfig?.fontColor ?? DEFAULT_CUSTOM_AVATAR_CONFIG.fontColor);
    setFont(avatar?.customAvatarConfig?.font ?? DEFAULT_CUSTOM_AVATAR_CONFIG.font);
    setShape(avatar?.customAvatarConfig?.shape ?? DEFAULT_CUSTOM_AVATAR_CONFIG.shape);
    setSelectedFile(null);
    setFileError(undefined);
    previousImageRefRef.current = avatar?.avatarType === 'image' ? avatar.avatarAssetRef : undefined;
  }, [open, avatar]);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
  const [uploadAvatarImage, { isLoading: isUploading }] = useUploadProfileAvatarImageMutation();
  const [deleteAvatarImage] = useDeleteProfileAvatarImageMutation();

  const isSaving = isUpdating || isCreating || isUploading;

  const saveProfileAvatar = async (profileAvatar: ProfileAvatar): Promise<boolean> => {
    const result = updateProfileSchema.safeParse({ profileAvatar });
    if (!result.success) {
      dispatch(openAlert({ severity: 'destructive', message: VALIDATION_ERROR_MESSAGE }));
      return false;
    }
    try {
      if (profileId) {
        await updateProfile({ id: profileId, data: result.data }).unwrap();
      } else {
        await createProfile({ ...result.data, user_id: userId }).unwrap();
      }
      return true;
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to update avatar' }));
      return false;
    }
  };

  const cleanUpPreviousImage = (nextAvatar: ProfileAvatar): void => {
    const previousRef = previousImageRefRef.current;
    const nextRef = nextAvatar.avatarType === 'image' ? nextAvatar.avatarAssetRef : undefined;
    if (previousRef && previousRef !== nextRef) {
      void deleteAvatarImage(parseAssetKey(previousRef));
    }
  };

  const handleCustomSave = async (): Promise<void> => {
    const nextAvatar: ProfileAvatar = {
      avatarType: 'custom',
      customAvatarConfig: { backgroundColor, fontColor, font, shape }
    };
    const saved = await saveProfileAvatar(nextAvatar);
    if (saved) {
      cleanUpPreviousImage(nextAvatar);
      dispatch(openAlert({ severity: 'success', message: 'Avatar updated' }));
      onOpenChange(false);
    }
  };

  const handleImageSave = async (): Promise<void> => {
    if (!selectedFile) {
      setFileError('Choose an image to upload');
      return;
    }
    setFileError(undefined);
    try {
      const uploaded = await uploadAvatarImage(selectedFile).unwrap();
      const nextAvatar: ProfileAvatar = { avatarType: 'image', avatarAssetRef: `/assets/by-key/${uploaded.key}` };
      const saved = await saveProfileAvatar(nextAvatar);
      if (saved) {
        cleanUpPreviousImage(nextAvatar);
        dispatch(openAlert({ severity: 'success', message: 'Avatar updated' }));
        onOpenChange(false);
      }
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to upload image' }));
    }
  };

  const handleSave = (): void => {
    if (activeTab === 'custom') {
      void handleCustomSave();
    } else {
      void handleImageSave();
    }
  };

  const previewUrl = React.useMemo(() => (selectedFile ? URL.createObjectURL(selectedFile) : undefined), [selectedFile]);
  React.useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border p-6">
          <DialogTitle>Update Avatar</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AvatarType)}>
            <TabsList>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="custom" className="flex flex-col gap-4">
              <UserAvatar
                user={{
                  avatarFallback: '?',
                  ...resolveAvatarDisplay({
                    avatarType: 'custom',
                    customAvatarConfig: { backgroundColor, fontColor, font, shape }
                  })
                }}
                className="size-16"
              />

              <div className="flex flex-col gap-1.5">
                <Label>Background Color</Label>
                <ColorPicker value={backgroundColor} onValueChange={setBackgroundColor} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Font Color</Label>
                <ColorPicker value={fontColor} onValueChange={setFontColor} />
              </div>

              <SelectField
                label="Font"
                value={font}
                onValueChange={(value) => setFont(value as AvatarFont)}
                options={AVATAR_FONT_OPTIONS}
              />

              <SelectField
                label="Shape"
                value={shape}
                onValueChange={(value) => setShape(value as AvatarShape)}
                options={AVATAR_SHAPE_OPTIONS}
              />
            </TabsContent>

            <TabsContent value="image" className="flex flex-col gap-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Selected avatar preview" className="size-16 rounded-full object-cover" />
              ) : null}
              <FileDropzone
                value={selectedFile}
                onChange={setSelectedFile}
                accept="image/png,image/jpeg,image/webp,image/gif"
                error={fileError}
              />
              {fileError ? (
                <Text as="span" size="xs" color="destructive">
                  {fileError}
                </Text>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="shrink-0 border-t border-border p-6">
          <Button type="button" variant="outlined" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" loading={isSaving} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
