import React from 'react';
import {
  AutoIncrementList,
  Button,
  ColorPicker,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FileDropzone,
  Label,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  TrianglifyPattern
} from '@inithium/ui';
import { DEFAULT_TRIANGLIFY_CONFIG, type BannerType, type ProfileBanner } from '@inithium/models';
import { updateProfileSchema } from '@inithium/validators';
import {
  openAlert,
  useAppDispatch,
  useCreateProfileMutation,
  useDeleteProfileBannerImageMutation,
  useUpdateProfileMutation,
  useUploadProfileBannerImageMutation
} from '@inithium/store';

const VALIDATION_ERROR_MESSAGE = 'There were errors in your form';

export interface UpdateBannerDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly userId: string;
  readonly profileId?: string;
  readonly banner?: ProfileBanner;
}

const parseAssetKey = (assetRef: string): string => assetRef.split('/').filter(Boolean).pop() ?? assetRef;

export const UpdateBannerDialog: React.FC<UpdateBannerDialogProps> = ({
  open,
  onOpenChange,
  userId,
  profileId,
  banner
}) => {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = React.useState<BannerType>(banner?.bannerType ?? 'trianglify');
  const [variance, setVariance] = React.useState(banner?.trianglifyConfig?.variance ?? DEFAULT_TRIANGLIFY_CONFIG.variance);
  const [cellSize, setCellSize] = React.useState(banner?.trianglifyConfig?.cell_size ?? DEFAULT_TRIANGLIFY_CONFIG.cell_size);
  const [xColors, setXColors] = React.useState<string[]>([
    ...(banner?.trianglifyConfig?.x_colors ?? DEFAULT_TRIANGLIFY_CONFIG.x_colors)
  ]);
  const [yColors, setYColors] = React.useState<string[]>([
    ...(banner?.trianglifyConfig?.y_colors ?? DEFAULT_TRIANGLIFY_CONFIG.y_colors)
  ]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | undefined>();

  const previousImageRefRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (!open) return;
    setActiveTab(banner?.bannerType ?? 'trianglify');
    setVariance(banner?.trianglifyConfig?.variance ?? DEFAULT_TRIANGLIFY_CONFIG.variance);
    setCellSize(banner?.trianglifyConfig?.cell_size ?? DEFAULT_TRIANGLIFY_CONFIG.cell_size);
    setXColors([...(banner?.trianglifyConfig?.x_colors ?? DEFAULT_TRIANGLIFY_CONFIG.x_colors)]);
    setYColors([...(banner?.trianglifyConfig?.y_colors ?? DEFAULT_TRIANGLIFY_CONFIG.y_colors)]);
    setSelectedFile(null);
    setFileError(undefined);
    previousImageRefRef.current = banner?.bannerType === 'image' ? banner.bannerAssetRef : undefined;
  }, [open, banner]);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [createProfile, { isLoading: isCreating }] = useCreateProfileMutation();
  const [uploadBannerImage, { isLoading: isUploading }] = useUploadProfileBannerImageMutation();
  const [deleteBannerImage] = useDeleteProfileBannerImageMutation();

  const isSaving = isUpdating || isCreating || isUploading;

  const saveProfileBanner = async (profileBanner: ProfileBanner): Promise<boolean> => {
    const result = updateProfileSchema.safeParse({ profileBanner });
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
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to update banner' }));
      return false;
    }
  };

  const cleanUpPreviousImage = (nextBanner: ProfileBanner): void => {
    const previousRef = previousImageRefRef.current;
    const nextRef = nextBanner.bannerType === 'image' ? nextBanner.bannerAssetRef : undefined;
    if (previousRef && previousRef !== nextRef) {
      void deleteBannerImage(parseAssetKey(previousRef));
    }
  };

  const handlePatternSave = async (): Promise<void> => {
    const nextBanner: ProfileBanner = {
      bannerType: 'trianglify',
      trianglifyConfig: { variance, cell_size: cellSize, x_colors: xColors, y_colors: yColors }
    };
    const saved = await saveProfileBanner(nextBanner);
    if (saved) {
      cleanUpPreviousImage(nextBanner);
      dispatch(openAlert({ severity: 'success', message: 'Banner updated' }));
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
      const uploaded = await uploadBannerImage(selectedFile).unwrap();
      const nextBanner: ProfileBanner = { bannerType: 'image', bannerAssetRef: `/assets/by-key/${uploaded.key}` };
      const saved = await saveProfileBanner(nextBanner);
      if (saved) {
        cleanUpPreviousImage(nextBanner);
        dispatch(openAlert({ severity: 'success', message: 'Banner updated' }));
        onOpenChange(false);
      }
    } catch {
      dispatch(openAlert({ severity: 'destructive', message: 'Failed to upload image' }));
    }
  };

  const handleSave = (): void => {
    if (activeTab === 'trianglify') {
      void handlePatternSave();
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
          <DialogTitle>Update Banner</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BannerType)}>
            <TabsList>
              <TabsTrigger value="trianglify">Pattern</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>

            <TabsContent value="trianglify" className="flex flex-col gap-4">
              <TrianglifyPattern
                config={{ variance, cell_size: cellSize, x_colors: xColors, y_colors: yColors }}
                className="h-32 w-full rounded-md"
              />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label>Variance</Label>
                  <Text size="xs" color="muted">
                    {variance.toFixed(2)}
                  </Text>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={[variance]}
                  onValueChange={([value]) => setVariance(value)}
                  aria-label="Variance"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label>Cell Size</Label>
                  <Text size="xs" color="muted">
                    {cellSize}
                  </Text>
                </div>
                <Slider
                  min={10}
                  max={150}
                  step={5}
                  value={[cellSize]}
                  onValueChange={([value]) => setCellSize(value)}
                  aria-label="Cell size"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Horizontal Colors</Label>
                <AutoIncrementList<string>
                  values={xColors}
                  onValuesChange={setXColors}
                  createItem={() => '#ffffff'}
                  renderItem={({ value, onChange }) => <ColorPicker value={value} onValueChange={onChange} />}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Vertical Colors</Label>
                <AutoIncrementList<string>
                  values={yColors}
                  onValuesChange={setYColors}
                  createItem={() => '#ffffff'}
                  renderItem={({ value, onChange }) => <ColorPicker value={value} onValueChange={onChange} />}
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="flex flex-col gap-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Selected banner preview" className="h-32 w-full rounded-md object-cover" />
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
