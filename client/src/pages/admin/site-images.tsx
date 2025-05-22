import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileUpload, UploadedFile } from "@/components/ui/file-upload";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LoaderPinwheel, Image as ImageIcon, Check } from "lucide-react";
import AdminLayout from "@/components/layout/admin-layout";

// Types for site images
interface SiteImage {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

interface ImageUploadFormData {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
}

const SiteImagesAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("hero");
  const [uploadedImage, setUploadedImage] = useState<UploadedFile | null>(null);
  const [formData, setFormData] = useState<ImageUploadFormData>({
    name: "",
    description: "",
    category: activeTab,
    imageUrl: "",
  });

  // Update form category when tab changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, category: activeTab }));
  }, [activeTab]);

  // Query to fetch site images
  const { data: siteImages, isLoading } = useQuery({
    queryKey: ["/api/site-images"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/site-images");
      return response.json();
    },
  });

  // Mutation to add a new site image
  const { mutate: addSiteImage, isPending: isAddingImage } = useMutation({
    mutationFn: async (formData: ImageUploadFormData) => {
      const response = await apiRequest("POST", "/api/site-images", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-images"] });
      toast({
        title: "Image added successfully",
        description: "The new site image has been added.",
      });
      resetForm();
    },
    onError: (error) => {
      console.error("Error adding site image:", error);
      toast({
        title: "Failed to add image",
        description: "There was an error adding the site image.",
        variant: "destructive",
      });
    },
  });

  // Mutation to update existing site image
  const { mutate: updateSiteImage, isPending: isUpdatingImage } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SiteImage> }) => {
      const response = await apiRequest("PUT", `/api/site-images/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-images"] });
      toast({
        title: "Image updated successfully",
        description: "The site image has been updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating site image:", error);
      toast({
        title: "Failed to update image",
        description: "There was an error updating the site image.",
        variant: "destructive",
      });
    },
  });

  // Mutation to delete site image
  const { mutate: deleteSiteImage, isPending: isDeletingImage } = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/site-images/${id}`);
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-images"] });
      toast({
        title: "Image deleted successfully",
        description: "The site image has been removed.",
      });
    },
    onError: (error) => {
      console.error("Error deleting site image:", error);
      toast({
        title: "Failed to delete image",
        description: "There was an error deleting the site image.",
        variant: "destructive",
      });
    },
  });

  // Handle file upload
  const handleFileUpload = (file: UploadedFile) => {
    setUploadedImage(file);
    setFormData(prev => ({ ...prev, imageUrl: file.url }));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.imageUrl) {
      toast({
        title: "Missing required fields",
        description: "Please provide a name and upload an image.",
        variant: "destructive",
      });
      return;
    }
    addSiteImage(formData);
  };

  // Reset form after submission
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: activeTab,
      imageUrl: "",
    });
    setUploadedImage(null);
  };

  // Filter images by category
  const getImagesByCategory = (category: string) => {
    return siteImages?.filter((image: SiteImage) => image.category === category) || [];
  };

  return (
    <AdminLayout 
      title="Manage Site Images"
      description="Upload and manage images that appear throughout the website">
      <Helmet>
        <title>Manage Site Images | Alnwick Community Center</title>
        <meta name="description" content="Admin interface for managing site images" />
      </Helmet>
      
      <p className="text-gray-600 mb-8">
        Change hero images, room photos, and other visual content to keep your site fresh and engaging.
      </p>

      <Tabs defaultValue="hero" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="hero">Hero Images</TabsTrigger>
          <TabsTrigger value="rooms">Room Images</TabsTrigger>
          <TabsTrigger value="events">Event Images</TabsTrigger>
          <TabsTrigger value="staff">Staff Photos</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        {/* Upload Form - Common to all tabs */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Add New Image</CardTitle>
            <CardDescription>
              Upload a new image to add to the {activeTab} section of the website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Image Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the image (optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Image <span className="text-red-500">*</span></Label>
                <FileUpload 
                  onFileUpload={handleFileUpload} 
                  acceptedFileTypes="image/*"
                  maxSizeMB={5}
                  showPreview
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported image formats: JPG, PNG, GIF, WebP, SVG, BMP, TIFF
                </p>
                {uploadedImage && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Image uploaded: {uploadedImage.originalName}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                disabled={isAddingImage || !formData.name || !formData.imageUrl}
              >
                {isAddingImage ? (
                  <>
                    <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Image"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Content for each tab */}
        <TabsContent value="hero">
          <h2 className="text-xl font-semibold mb-4">Hero Banner Images</h2>
          <p className="text-gray-600 mb-6">
            These images appear in the homepage hero banner and other prominent locations.
            Upload high-quality, wide images (1920×600 pixels recommended).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 flex justify-center py-10">
                <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              getImagesByCategory("hero").map((image: SiteImage) => (
                <ImageCard 
                  key={image.id} 
                  image={image}
                  onDelete={deleteSiteImage}
                  onUpdate={updateSiteImage}
                  isDeleting={isDeletingImage}
                />
              ))
            )}
            {!isLoading && getImagesByCategory("hero").length === 0 && (
              <div className="col-span-3 py-8 text-center border rounded-lg bg-gray-50">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">No hero images added yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <h2 className="text-xl font-semibold mb-4">Room & Rental Images</h2>
          <p className="text-gray-600 mb-6">
            These images are used to showcase rooms and rental spaces. 
            Upload clear, well-lit photos (1200×800 pixels recommended).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 flex justify-center py-10">
                <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              getImagesByCategory("rooms").map((image: SiteImage) => (
                <ImageCard 
                  key={image.id} 
                  image={image}
                  onDelete={deleteSiteImage}
                  onUpdate={updateSiteImage}
                  isDeleting={isDeletingImage}
                />
              ))
            )}
            {!isLoading && getImagesByCategory("rooms").length === 0 && (
              <div className="col-span-3 py-8 text-center border rounded-lg bg-gray-50">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">No room images added yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <h2 className="text-xl font-semibold mb-4">Event Images</h2>
          <p className="text-gray-600 mb-6">
            These images appear on event listings and promotions.
            Upload engaging photos of community events (1200×800 pixels recommended).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 flex justify-center py-10">
                <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              getImagesByCategory("events").map((image: SiteImage) => (
                <ImageCard 
                  key={image.id} 
                  image={image}
                  onDelete={deleteSiteImage}
                  onUpdate={updateSiteImage}
                  isDeleting={isDeletingImage}
                />
              ))
            )}
            {!isLoading && getImagesByCategory("events").length === 0 && (
              <div className="col-span-3 py-8 text-center border rounded-lg bg-gray-50">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">No event images added yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <h2 className="text-xl font-semibold mb-4">Staff & Leadership Photos</h2>
          <p className="text-gray-600 mb-6">
            These images appear on the about page and staff listings.
            Upload professional headshots (500×500 pixels recommended).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 flex justify-center py-10">
                <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              getImagesByCategory("staff").map((image: SiteImage) => (
                <ImageCard 
                  key={image.id} 
                  image={image}
                  onDelete={deleteSiteImage}
                  onUpdate={updateSiteImage}
                  isDeleting={isDeletingImage}
                />
              ))
            )}
            {!isLoading && getImagesByCategory("staff").length === 0 && (
              <div className="col-span-3 py-8 text-center border rounded-lg bg-gray-50">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">No staff photos added yet</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <h2 className="text-xl font-semibold mb-4">Gallery Images</h2>
          <p className="text-gray-600 mb-6">
            These images appear in the photo gallery section.
            Upload diverse photos showing community activities and the center's facilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 flex justify-center py-10">
                <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              getImagesByCategory("gallery").map((image: SiteImage) => (
                <ImageCard 
                  key={image.id} 
                  image={image}
                  onDelete={deleteSiteImage}
                  onUpdate={updateSiteImage}
                  isDeleting={isDeletingImage}
                />
              ))
            )}
            {!isLoading && getImagesByCategory("gallery").length === 0 && (
              <div className="col-span-3 py-8 text-center border rounded-lg bg-gray-50">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">No gallery images added yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

// Image Card Component
const ImageCard = ({ 
  image, 
  onDelete, 
  onUpdate,
  isDeleting 
}: { 
  image: SiteImage; 
  onDelete: (id: number) => void;
  onUpdate: (data: { id: number; data: Partial<SiteImage> }) => void;
  isDeleting: boolean;
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: image.name,
    description: image.description || "",
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    onUpdate({ id: image.id, data: editData });
    setIsEditMode(false);
  };

  return (
    <Card>
      <div className="relative pb-[66.67%] overflow-hidden">
        <img 
          src={image.imageUrl} 
          alt={image.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        {isEditMode ? (
          <div className="space-y-3 py-2">
            <Input
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              placeholder="Image name"
            />
            <Input
              name="description"
              value={editData.description}
              onChange={handleEditChange}
              placeholder="Description (optional)"
            />
          </div>
        ) : (
          <>
            <h3 className="font-medium text-lg">{image.name}</h3>
            {image.description && (
              <p className="text-gray-600 text-sm mt-1">{image.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">Added: {new Date(image.createdAt).toLocaleDateString()}</p>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        {isEditMode ? (
          <>
            <Button size="sm" variant="outline" onClick={() => setIsEditMode(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdate}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)}>
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(image.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default SiteImagesAdmin;