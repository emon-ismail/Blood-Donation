import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Icon from './AppIcon';
import { useAuth } from '../contexts/AuthContext';

const RatingModal = ({ isOpen, onClose, donor, onSubmit }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      alert('অনুগ্রহ করে রেটিং দিন');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        donorId: donor.id,
        rating,
        comment: comment.trim(),
        reviewerId: user?.id,
        reviewerName: user?.name
      });
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Rating submission failed:', error);
      alert('রেটিং দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const StarButton = ({ index }) => {
    const filled = index <= (hoveredRating || rating);
    return (
      <button
        type="button"
        onClick={() => setRating(index)}
        onMouseEnter={() => setHoveredRating(index)}
        onMouseLeave={() => setHoveredRating(0)}
        className="transition-transform hover:scale-110"
      >
        <Icon
          name="Star"
          size={32}
          className={`${filled ? 'text-warning fill-current' : 'text-muted-foreground'} transition-colors`}
        />
      </button>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="রেটিং ও মন্তব্য দিন"
      size="md"
    >
      <div className="space-y-6">
        {/* Donor Info */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {donor?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="font-bengali font-semibold text-text-primary">
                {donor?.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {donor?.bloodGroup} • {donor?.location}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <label className="block text-sm font-medium text-text-primary mb-3 font-bengali">
              আপনার অভিজ্ঞতা কেমন ছিল?
            </label>
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <StarButton key={index} index={index} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-bengali">
              {rating === 0 && 'রেটিং নির্বাচন করুন'}
              {rating === 1 && 'খুবই খারাপ'}
              {rating === 2 && 'খারাপ'}
              {rating === 3 && 'মোটামুটি'}
              {rating === 4 && 'ভালো'}
              {rating === 5 && 'চমৎকার'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2 font-bengali">
              মন্তব্য (ঐচ্ছিক)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="আপনার অভিজ্ঞতা সম্পর্কে লিখুন..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-bengali resize-none"
              rows="4"
              maxLength="500"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {comment.length}/500
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-bengali"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={loading}
              className="flex-1 font-bengali"
            >
              {loading ? 'জমা দিচ্ছি...' : 'রেটিং দিন'}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="bg-trust/5 border border-trust/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} color="var(--color-trust)" className="mt-0.5" />
            <div className="text-sm">
              <p className="font-bengali text-trust font-medium mb-1">রেটিং নীতি:</p>
              <ul className="font-bengali text-trust/80 space-y-1 text-xs">
                <li>• শুধুমাত্র নিবন্ধিত ব্যবহারকারীরা রেটিং দিতে পারবেন</li>
                <li>• প্রতি দাতাকে একবারই রেটিং দেওয়া যাবে</li>
                <li>• অনুপযুক্ত মন্তব্য মুছে দেওয়া হবে</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RatingModal;