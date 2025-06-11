import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Upload,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Download,
  Trash2,
  Search,
  Grid,
  List,
  FileX,
  Plus,
  Command,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function ArchivePage() {
  const { user, setId, setBoardId, access } = useContext(AuthContext);
  const params = useParams();
  const boardId = params?.id;
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.email && boardId) {
      setBoardId(boardId);
      setId(user?.email);
    }
  }, []);

  const id = user?.id;

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/archive/files`
      );
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching files", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = async (newFiles) => {
    try {
      setLoading(true);

      const formData = new FormData();
      newFiles.forEach((file) => formData.append("files", file));
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/archive/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadedFiles = await res.json();

      setFiles((prev) => [...prev, ...uploadedFiles]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/archive/file/${fileId}`,
        {
          method: "DELETE",
        }
      );

      setFiles((prev) => prev.filter((file) => file.id !== fileId));
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/archive/files/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedFiles }),
      });

      setFiles((prev) =>
        prev.filter((file) => !selectedFiles.includes(file.id))
      );
      setSelectedFiles([]);
    } catch (err) {
      console.error("Bulk delete failed", err);
    }
  };

  const handleDownload = (file) => {
    // In a real app, this would download the actual file
    const link = document.createElement("a");
    link.href = file.url || file.path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    const filteredFiles = getFilteredFiles();
    if (
      selectedFiles.length === filteredFiles.length &&
      filteredFiles.length > 0
    ) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id));
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/"))
      return <Image className="h-8 w-8 text-blue-500" />;
    if (type.startsWith("video/"))
      return <Video className="h-8 w-8 text-purple-500" />;
    if (type.startsWith("audio/"))
      return <Music className="h-8 w-8 text-green-500" />;
    if (type.includes("pdf"))
      return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes("zip") || type.includes("rar"))
      return <Archive className="h-8 w-8 text-yellow-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFilteredFiles = () => {
    return files.filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === "all" ||
        (filterType === "images" && file.type.startsWith("image/")) ||
        (filterType === "documents" &&
          (file.type.includes("pdf") || file.type.includes("doc"))) ||
        (filterType === "videos" && file.type.startsWith("video/")) ||
        (filterType === "audio" && file.type.startsWith("audio/"));

      return matchesSearch && matchesFilter;
    });
  };

  const renderEmptyState = () => (
    <div className="text-center text-gray-400 py-16">
      <FileX className="mx-auto mb-4 w-12 h-12" />
      <p className="text-lg font-medium">No files found</p>
      <p className="text-sm mt-1">
        Try adjusting your filters or uploading new files.
      </p>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {getFilteredFiles().map((file) => (
        <div
          key={file.id}
          className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all cursor-pointer ${
            selectedFiles.includes(file.id)
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => handleFileSelect(file.id)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">{getFileIcon(file.type)}</div>
            <h3
              className="font-medium text-sm text-gray-900 mb-1 truncate w-full"
              title={file.name}
            >
              {file.name}
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              {formatFileSize(file.size)}
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(file.uploadDate)}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(file);
                }}
                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.id);
                }}
                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={
                    selectedFiles.length === getFilteredFiles().length &&
                    getFilteredFiles().length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="text-left p-4 font-medium text-gray-600">Name</th>
              <th className="text-left p-4 font-medium text-gray-600">Size</th>
              <th className="text-left p-4 font-medium text-gray-600">Type</th>
              <th className="text-left p-4 font-medium text-gray-600">
                Modified
              </th>
              <th className="text-left p-4 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {getFilteredFiles().map((file) => (
              <tr
                key={file.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  selectedFiles.includes(file.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <span className="font-medium text-gray-900">
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  {formatFileSize(file.size)}
                </td>
                <td className="p-4 text-gray-600">{file.type}</td>
                <td className="p-4 text-gray-600">
                  {formatDate(file.uploadDate)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="w-full p-2 mb-8 select-none flex justify-between items-center flex-wrap">
      <div className="flex flex-col">
        <h1 className="text-3xl font-medium text-gray-700 tracking-tight">
          Archives
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all your important docs and files.
        </p>
      </div>
      <p className="text-gray-400 text-sm flex justify-center items-center gap-1">
        <Command className="h-4 w-4 text-gray-600" />
        <span className="text-gray-500 font-semibold">board-</span>
        {id}
      </p>
    </div>
  );

  const renderUploadArea = () => (
    <div className="mb-8">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div
            className={`p-4 rounded-full ${dragActive ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <Upload
              className={`h-8 w-8 ${dragActive ? "text-blue-500" : "text-gray-500"}`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Support for all file types up to 10MB each
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              {loading ? "Uploading..." : "Choose Files"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Files</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
            <option value="videos">Videos</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedFiles.length})
            </button>
          )}
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {selectedFiles.length === getFilteredFiles().length &&
            getFilteredFiles().length > 0
              ? "Deselect All"
              : "Select All"}
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {files.length > 0 && (
        <div className="text-sm text-gray-600">
          {getFilteredFiles().length} of {files.length} files
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-w-7xl mx-auto p-6">
        {renderHeader()}
        {access.permission === "editor" && renderUploadArea()}
        {renderControls()}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : getFilteredFiles().length > 0 ? (
          viewMode === "grid" ? (
            renderGridView()
          ) : (
            renderListView()
          )
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
}

export default ArchivePage;
